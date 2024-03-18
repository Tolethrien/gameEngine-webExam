import EntityManager from "../../core/dogma/entityManager";
import System from "../../core/dogma/system";
import Vec2D from "../../core/math/vec2D";
import Time from "../../core/modules/time/time";
import DepthQuadTree, {
  DepthQuadTreeType,
} from "../../core/utils/quadTree/depthQuadTree";
import { IndieRigidBodyType } from "../components/indieRigidBody";
import { TransformType } from "../components/transform";
type IndieCollisionManifold = {
  bodyA: string;
  bodyB: string;
  depth: number;
  normal: Vec2DType;
  done: boolean;
};
export default class indiePhysics extends System {
  quadTree!: DepthQuadTreeType;
  rigidBodies!: GetComponentsList<IndieRigidBodyType>;
  transforms!: GetComponentsList<TransformType>;
  manifolds!: IndieCollisionManifold[];
  dynamicEntities: IndieRigidBodyType["entityID"][];
  precision: number;
  debugQuad: boolean;
  frameSkipVelocity: number;
  constructor() {
    super();
    this.dynamicEntities = [];
    this.manifolds = [];
    this.precision = 4;
    this.debugQuad = false;
    this.frameSkipVelocity = 3;
  }

  onSubscribeList(): void {
    this.rigidBodies = this.getComponents("IndieRigidBody");
    this.transforms = this.getComponents("Transform");
  }
  onStart() {
    this.createQuad();
  }

  onUpdate() {
    const time = Time.getSeconds / this.precision;
    this.manageEntities();
    for (let cycle = 0; cycle < this.precision; cycle++) {
      this.manifolds.length = 0;
      this.step(time);
      this.collisionDetection();
      this.calculateDeltaNormal();
      this.seperateEntities();
      this.aplyImpulses();
    }
  }

  private step(time: number) {
    this.rigidBodies.forEach((rigid) => {
      if (rigid.bodyType === "static") return;
      if (!rigid.velocity.isZero || !rigid.force.isZero) {
        const transform = this.transforms.get(rigid.entityID)!;
        rigid.velocity = rigid.velocity.add(rigid.force);
        transform.position = transform.position.add(
          rigid.velocity.multiply(time)
        );
        rigid.velocity = rigid.velocity.multiply(1 - rigid.friction / 10);
        this.quadTree.move({
          body: this.getCollider(rigid),
          entityId: rigid.entityID,
        });
        rigid.force = Vec2D.Zero;
        this.stopOnFrameLag(rigid);
      }
    });
  }
  private manageEntities() {
    const { added, removed } = EntityManager.getManipulatedLastFrame;
    added.forEach((entity) => {
      const rigid = this.rigidBodies.get(entity);
      if (rigid) {
        this.addEntitiesToQuad(rigid);
      }
    });
    removed.forEach((entity) => {
      this.removeEntitiesFromQuad(entity);
    });
  }
  private moveEntity(
    transform: TransformType,
    normal: IndieCollisionManifold["normal"],
    axisDepth: IndieCollisionManifold["depth"]
  ) {
    transform.position = transform.position.add(normal.multiply(axisDepth));
  }
  private collisionDetection() {
    this.dynamicEntities.forEach((entity) => {
      const rigid = this.rigidBodies.get(entity)!;
      const query = this.quadTree.query(this.getCollider(rigid), entity);
      query.forEach((collisionTarget) => {
        const inList = this.manifolds.find((e) => e.bodyA === collisionTarget);
        if (inList === undefined)
          this.manifolds.push({
            bodyA: entity,
            bodyB: collisionTarget,
            depth: Number.MIN_VALUE,
            normal: Vec2D.Zero,
            done: false,
          });
      });
    });
  }

  private calculateDeltaNormal() {
    this.manifolds.forEach((manifold) => {
      const rigidA = this.rigidBodies.get(manifold.bodyA)!;
      const rigidB = this.rigidBodies.get(manifold.bodyB)!;
      const bodyA = this.getCollider(rigidA);
      const bodyB = this.getCollider(rigidB);
      const axisXPen = bodyA.w + bodyB.w - Math.abs(bodyA.x - bodyB.x);
      const axisYPen = bodyA.h + bodyB.h - Math.abs(bodyA.y - bodyB.y);
      const axisDepth = Math.min(axisXPen, axisYPen);
      axisDepth === axisXPen
        ? (manifold.normal = Vec2D.NormalX)
        : (manifold.normal = Vec2D.NormalY);
      if (
        new Vec2D([bodyB.x, bodyB.y])
          .sub(new Vec2D([bodyA.x, bodyA.y]))
          .dotProduct(manifold.normal) < 0
      )
        manifold.normal = manifold.normal.oposite();
      manifold.depth = axisDepth;
    });
  }
  private seperateEntities() {
    this.manifolds.forEach((manifold) => {
      const posA = this.transforms.get(manifold.bodyA)!;
      const rigidA = this.rigidBodies.get(manifold.bodyA)!;
      const posB = this.transforms.get(manifold.bodyB)!;
      const rigidB = this.rigidBodies.get(manifold.bodyB)!;

      if (this.inBoundries(rigidA, rigidB)) {
        if (rigidA.bodyType === "static" || rigidA.mass === 0) {
          this.moveEntity(posB, manifold.normal, manifold.depth);
        } else if (rigidB.bodyType === "static" || rigidB.mass === 0) {
          this.moveEntity(posA, manifold.normal.oposite(), manifold.depth);
        } else {
          this.moveEntity(posA, manifold.normal.oposite(), manifold.depth / 2);
          this.moveEntity(posB, manifold.normal, manifold.depth / 2);
        }
      } else manifold.done = true;
    });
  }
  private aplyImpulses() {
    this.manifolds.forEach((manifold) => {
      if (!manifold.done) {
        const bodyARigid = this.rigidBodies.get(manifold.bodyA)!;
        const bodyBRigid = this.rigidBodies.get(manifold.bodyB)!;
        const relativeVelo = bodyBRigid.velocity.sub(bodyARigid.velocity);
        const minResti = Math.min(
          bodyARigid.restitution,
          bodyBRigid.restitution
        );
        if (relativeVelo.dotProduct(manifold.normal) > 0) return;
        let maginutudeOfImpuls =
          -(1 + minResti) * relativeVelo.dotProduct(manifold.normal);
        maginutudeOfImpuls /= bodyARigid.inverceMass + bodyBRigid.inverceMass;
        const impulse = manifold.normal.multiply(maginutudeOfImpuls);
        bodyARigid.velocity = bodyARigid.velocity.add(
          impulse.multiply(bodyARigid.inverceMass).multiply(-1)
        );
        bodyBRigid.velocity = bodyBRigid.velocity.add(
          impulse.multiply(bodyBRigid.inverceMass).multiply(1)
        );
      }
    });
  }
  //QuadTree
  private createQuad() {
    this.quadTree = new DepthQuadTree({
      boundry: {
        x: 450,
        y: 350,
        h: 900,
        w: 700,
      },
    });
    this.rigidBodies.forEach((rigid) => {
      this.addEntitiesToQuad(rigid);
    });
  }
  private stopOnFrameLag(rigid: IndieRigidBodyType) {
    if (Math.abs(rigid.velocity.x) < this.frameSkipVelocity) {
      rigid.velocity = rigid.velocity.setAxis("x", 0);
    }
    if (Math.abs(rigid.velocity.y) < this.frameSkipVelocity) {
      rigid.velocity = rigid.velocity.setAxis("y", 0);
    }
  }
  private addEntitiesToQuad(rigid: IndieRigidBodyType) {
    const body = this.getCollider(rigid);
    this.quadTree.insert({
      body: body,
      entityId: rigid.entityID,
    });
    rigid.bodyType === "dynamic" && this.dynamicEntities.push(rigid.entityID);
  }
  private removeEntitiesFromQuad(entityID: string) {
    this.quadTree.remove(entityID);
    const isDynamic = this.dynamicEntities.findIndex(
      (dynamic) => dynamic === entityID
    );
    isDynamic !== -1 && this.dynamicEntities.splice(isDynamic, 1);
  }

  private getCollider(rigid: IndieRigidBodyType) {
    if (rigid.cashedColiderData) return rigid.cashedColiderData;
    const transform = this.transforms.get(rigid.entityID)!;
    if (!rigid.offset)
      return {
        x: transform.position.get.x,
        y: transform.position.get.y,
        w: transform.size.get.x,
        h: transform.size.get.y,
      };
    const data = {
      x: transform.position.get.x + rigid.offset.x,
      y: transform.position.get.y + rigid.offset.y,
      w: rigid.offset.w,
      h: rigid.offset.h,
    };
    if (rigid.bodyType === "static") rigid.cashedColiderData = data;
    return data;
  }

  private inBoundries(rigidA: IndieRigidBodyType, rigidB: IndieRigidBodyType) {
    const bodyA = this.getCollider(rigidA);
    const bodyB = this.getCollider(rigidB);
    return (
      bodyA.x + bodyA.w > bodyB.x - bodyB.w &&
      bodyA.x - bodyA.w < bodyB.x + bodyB.w &&
      bodyA.y + bodyA.h > bodyB.y - bodyB.h &&
      bodyA.y - bodyA.h < bodyB.y + bodyB.h &&
      true
    );
  }
}

export default class Time {
  private static lastFrameTime = 0;
  private static elapsedTime = 0;
  private static maxDelta = 100;
  private static frameCounter = 0;
  private static lastFrames: number[] = [];

  public static calculateTimeStamp(timestamp: number) {
    let delta = timestamp - this.lastFrameTime;
    if (delta > this.maxDelta) delta = this.maxDelta;
    this.elapsedTime = delta;
    this.lastFrameTime = timestamp;
    if (this.lastFrames.length === 60) this.lastFrames.shift();
    this.lastFrames.push(this.elapsedTime);
    this.frameCounter++;
  }
  public static get getMilliSeconds() {
    return this.elapsedTime;
  }
  public static get getSeconds() {
    return this.elapsedTime / 1000;
  }
  public static get getFrameCount() {
    return this.frameCounter;
  }
  public static get getLastFrames() {
    return this.lastFrames;
  }
}

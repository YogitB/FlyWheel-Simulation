package frc.robot.subsystems;

public class FlywheelController {
    //declare constants
    private double p,i,d,f,s;
    private double errorSum=0;
    private double lastError=0;
    //calculation loop
    public FlywheelController(double p, double i, double d, double f, double s){
        this.p=p;
        this.i=i;
        this.d=d;
        this.f=f;
        this.s=s;
    }
    public double calculate(double targetRpm, double currentRpm, double dt) {
        double error = targetRpm - currentRpm;
        
        // Use proper constants mapping
        double pOutput = p * error;
        double feedforward = f * targetRpm;

        double output = pOutput + feedforward;

        // Safety clamp (-12V to 12V)
        return Math.max(-12.0, Math.min(12.0, output));
    }
}

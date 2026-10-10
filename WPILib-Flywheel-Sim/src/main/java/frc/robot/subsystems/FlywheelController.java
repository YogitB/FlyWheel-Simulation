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
    public double calculate(double targetRpm, double currentRpm, double dt){
        //Find the error
        double error= targetRpm-currentRpm;
        // Update the integral and derivative
        errorSum+=error*dt;
        double errorRate= (error-lastError)*dt;
        lastError=error;
        double output=(p*error)+(i*errorSum)+(d*errorRate)+(f * targetRpm) + (s * Math.signum(targetRpm));
        return output;
    }
}

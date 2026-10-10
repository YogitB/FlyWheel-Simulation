package frc.robot.subsystems;

public class FlywheelController {
    //declare constants
    private double kP, kI, kD, kV, kS;
    private double errorSum=0;
    private double lastError=0;
    //calculation loop
    public oduble calculate(double targetRpm, double currentRpm, double dt){
        //Find the error
        double error= targetRpm-currentRpm;
        // Update the integral and derivative
        errorSum+=error*dt;
        double errorDerivative= (error-lastError)/dt;
        lastError=error;
        //Calculate feedforward
        double feedforward= (kV*targetRpm)+(Math.signum(targetRpm)*kS);
        //Calculate the feedback
        double feedback= (kP*error)+(kI*errorSum)+(kD*errorDerivative);
        //return voltage
        return feedforward+feedback;
    }
}

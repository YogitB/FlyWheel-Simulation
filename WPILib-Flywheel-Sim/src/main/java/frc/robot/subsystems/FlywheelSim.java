package frc.robot.subsystems;

public class FlywheelSim {
    private double momentOfInertia; //This is I
    private double kv; // This is a velocity constant
    private double ka; //Constant Acceleration
    private double currentRpm=0.0;
    // Creating constructor of the object
    public FlywheelSim(double inertia, double kv, double ka){
        this.momentOfInertia=inertia;
        this.kv=kv;
        this.ka=ka;
    }
    public void update(double appliedVoltage, double dt){
        // Adding clamps 
        appliedVoltage= Math.max(-12.0, Math.min(12.0, appliedVoltage));
        //Convert RPM to raidans
        double omega = currentRpm* (2*Math.PI /60.0);

        // Calculate aplha angle acceleration
        double alpha = (appliedVoltage-(kv*omega))/ka;
        // Update velocity
        omega+=alpha *dt;
        currentRpm=omega*(60.0/(2*Math.PI));
        if(currentRpm<0){
            currentRpm=0;
        }
        if(currentRpm>6000){
            currentRpm=6000;
        }
    }
    public void applyLoad(double rpmDrop){
        currentRpm-=rpmDrop;
        if (currentRpm<0){
            currentRpm=0;
        }
    }
    public double getRpm(){
        return currentRpm;
    }
}

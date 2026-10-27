package frc.robot.subsystems;

import edu.wpi.first.math.MathUtil;
import edu.wpi.first.math.controller.PIDController;
import edu.wpi.first.math.geometry.Pose3d;
import edu.wpi.first.math.geometry.Rotation3d;
import edu.wpi.first.math.system.plant.DCMotor;
import edu.wpi.first.math.system.plant.LinearSystemId;
import edu.wpi.first.math.util.Units;
import edu.wpi.first.wpilibj.simulation.FlywheelSim;
import edu.wpi.first.wpilibj.smartdashboard.Mechanism2d;
import edu.wpi.first.wpilibj.smartdashboard.MechanismLigament2d;
import edu.wpi.first.wpilibj.smartdashboard.MechanismRoot2d;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj.util.Color;
import edu.wpi.first.wpilibj.util.Color8Bit;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class FlywheelSubsystem extends SubsystemBase {
    private static final double kVisualScale = 0.05;

    private final DCMotor gearbox = DCMotor.getNEO(1);
    private final FlywheelSim flysim = new FlywheelSim(
        LinearSystemId.createFlywheelSystem(gearbox, 0.0008, 1.0), gearbox);

    private final double kV = 1.0 / gearbox.KvRadPerSecPerVolt;
    private final PIDController pid = new PIDController(0.02, 0.0, 0.0);

    private final Mechanism2d mech = new Mechanism2d(3, 3);
    private final MechanismRoot2d root = mech.getRoot("FlywheelRoot", 1.5, 1.5);
    private final MechanismLigament2d lig = root.append(
        new MechanismLigament2d("FlywheelWheel", 1.0, 0.0, 6, new Color8Bit(Color.kAliceBlue)));

    private double degrees = 0.0;
    private double appliedVolts = 0.0;

    public FlywheelSubsystem() {
        SmartDashboard.putData("Flywheel Mechanism", mech);
        SmartDashboard.putData("Flywheel/PID", pid);
        SmartDashboard.putNumber("Flywheel/VoltageCmd", 0.0);
        SmartDashboard.putNumber("Flywheel/TargetRPM", 0.0);
        SmartDashboard.putBoolean("Flywheel/ClosedLoop", false);
        SmartDashboard.putBoolean("Flywheel/FFEnabled", true);
        SmartDashboard.putNumber("Flywheel/DisturbanceVolts", 0.0);
    }

    @Override
    public void periodic() {
        double measured = flysim.getAngularVelocityRadPerSec();
        double targetRpm = SmartDashboard.getNumber("Flywheel/TargetRPM", 0.0);
        double target = Units.rotationsPerMinuteToRadiansPerSecond(targetRpm);

        double volts;
        if (SmartDashboard.getBoolean("Flywheel/ClosedLoop", false)) {
            double ff = SmartDashboard.getBoolean("Flywheel/FFEnabled", true) ? kV * target : 0.0;
            volts = ff + pid.calculate(measured, target);
        } else {
            pid.reset();
            volts = SmartDashboard.getNumber("Flywheel/VoltageCmd", 0.0);
        }
        appliedVolts = MathUtil.clamp(volts, -12.0, 12.0);

        double rpm = Units.radiansPerSecondToRotationsPerMinute(measured);
        SmartDashboard.putNumber("Flywheel/RPM", rpm);
        SmartDashboard.putNumber("Flywheel/ErrorRPM", targetRpm - rpm);
        SmartDashboard.putNumber("Flywheel/AppliedVolts", appliedVolts);
    }

    @Override
    public void simulationPeriodic() {
        double disturbance = SmartDashboard.getNumber("Flywheel/DisturbanceVolts", 0.0);
        flysim.setInputVoltage(appliedVolts - disturbance);
        flysim.update(0.02);

        double rpm = flysim.getAngularVelocityRPM();
        degrees = (degrees + rpm * 0.12 * kVisualScale) % 360.0;
        lig.setAngle(degrees);

        Pose3d pose = new Pose3d(0.0, 0.0, 0.5, new Rotation3d(0, Math.toRadians(degrees), 0));
        var q = pose.getRotation().getQuaternion();
        SmartDashboard.putNumberArray("Flywheel3D", new double[] {
            pose.getX(), pose.getY(), pose.getZ(),
            q.getW(), q.getX(), q.getY(), q.getZ()
        });
    }
}
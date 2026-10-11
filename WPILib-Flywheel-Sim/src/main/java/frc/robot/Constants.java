// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

package frc.robot;

/**
 * The Constants class provides a convenient place for teams to hold robot-wide numerical or boolean
 * constants. This class should not be used for any other purpose. All constants should be declared
 * globally (i.e. public static). Do not put anything functional in this class.
 *
 * <p>It is advised to statically import this class (or one of its inner classes) wherever the
 * constants are needed, to reduce verbosity.
 */
public final class Constants {
  public static class OperatorConstants {
    public static final int kDriverControllerPort = 0;
  }
  public static final class FlywheelConstants{
    public static final double TARGET_RPM=4000.0;
    public static final double LOOP_PERIOD_SECONDS=0.02;//Standard Loop
    // Constants for the physical loop 
    public static final double MOMENT_OF_INERTIA=0.02;//Inertia of flywheel
    public static final double KV=0.0012;//Friction constant
        public static final double KA=0.05;//Acceleration constant
        //Tuning can be required for specific hardware
        public static final double kP=0.004; //Proportional gain
        public static final double kI=0.0;//Integral gain
        public static final double kD=0.0;//Derivative gain
        public static final double kF=0.00055;//feedforward gain
        public static final double kS=0.0;



  }
}

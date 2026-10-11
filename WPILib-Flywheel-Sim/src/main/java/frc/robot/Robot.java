// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

package frc.robot;
import frc.robot.subsystems.FlywheelSim;
import frc.robot.subsystems.FlywheelController;
import static frc.robot.Constants.FlywheelConstants.*;
import edu.wpi.first.wpilibj.TimedRobot;
import edu.wpi.first.wpilibj2.command.Command;
import edu.wpi.first.wpilibj2.command.CommandScheduler;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj.smartdashboard.Mechanism2d;
import edu.wpi.first.wpilibj.smartdashboard.MechanismRoot2d;
import edu.wpi.first.wpilibj.smartdashboard.MechanismLigament2d;
import edu.wpi.first.wpilibj.util.Color8Bit;
import edu.wpi.first.wpilibj.util.Color;

/**
 * The methods in this class are called automatically corresponding to each mode, as described in
 * the TimedRobot documentation. If you change the name of this class or the package after creating
 * this project, you must also update the Main.java file in the project.
 */
public class Robot extends TimedRobot{
  private FlywheelSim sim;
  private FlywheelController controller;
  private final Mechanism2d mech= new Mechanism2d(3, 3);
  private final MechanismRoot2d root= mech.getRoot("FlywheelRoot",1.5, 1.5);
  private final MechanismLigament2d flywheelVis= root.append(new MechanismLigament2d("FlywheelWheel", 0.5, 0,6,new Color8Bit(Color.kGold)));
  //Set the target launch speed for the balls
  private final double TARGET_RPM=4000.0;
  private final double DT=0.02;//Loop time for WPILIB
  @Override
  public void robotInit(){
    // Use flywheel numbers
    sim = new FlywheelSim(0.001,0.002,0.0001);
    //Initiate the controller
    controller= new FlywheelController(0.002,0.0,0.0001,0.002,0.1);
    SmartDashboard.putData("Flywheel Sim Visualizer",mech);
    
  }
  public int loopCount=0;
  @Override
  public void simulationPeriodic(){
    loopCount++;
    if (loopCount==150){
      sim.applyLoad(1200.0);
      System.out.println("Pollen ball entered flywheel");

    }
      //Calculate how much voltage the controller needs
      double voltage= controller.calculate(TARGET_RPM,sim.getRpm(), DT);
      //Feed that voltage in
      sim.update(voltage,DT);
      //Print out RPM
      System.out.printf("Target: %.0f RPM | Actual: %.2f RPM | Voltage: %.2f V\n",
        TARGET_RPM, sim.getRpm(), voltage);
    }
    @Override
    public void teleopPeriodic(){
      
    }

}
  
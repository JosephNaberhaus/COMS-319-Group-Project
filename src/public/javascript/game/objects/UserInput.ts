import { Player } from "../objects/Player.js";
import { GameScene } from "../scenes/GameScene";
import { PlayerMoveDirection, PlayerMoveUpdate } from "../models/PlayerMoveUpdate.js";
import { GameObject } from "./GameObject";
import { Scene } from "phaser";

export class UserInput {
    /**
     * The W key
     */
    private keyW: Phaser.Input.Keyboard.Key;
    /**
     * The A key
     */
    private keyA: Phaser.Input.Keyboard.Key;
    /**
     * The S key
     */
    private keyS: Phaser.Input.Keyboard.Key;
    /**
     * The D key
     */
    private keyD: Phaser.Input.Keyboard.Key;
    /**
     * The UP arrow key
     */
    private keyUp: Phaser.Input.Keyboard.Key;
    /**
     * The LEFT arrow key
     */
    private keyLeft: Phaser.Input.Keyboard.Key;
    /**
     * The DOWN arrow key
     */
    private keyDown: Phaser.Input.Keyboard.Key;
    /**
     * The RIGHT key
     */
    private keyRight: Phaser.Input.Keyboard.Key;
    /**
     * The mouse pointer
     */
    private mousePointer: Phaser.Input.Pointer;
    /**
     * The main camera from the game scene
     */
    private camera: Phaser.Cameras.Scene2D.Camera;

    private scene: Phaser.Scene;

    /**
     * Creates a UserInput object that handles input from the user.
     *
     * @param scene the scene the player is in
     * @param player the player to be moved
     */
    constructor(scene: GameScene) {
        this.camera = scene.cameras.main;
        this.scene = scene;
        // Keyboard inputs
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // Mouse inputs
        this.mousePointer = scene.input.activePointer;
    }

    checkDirection(): PlayerMoveDirection {
        if (this.scene.input.enabled) {
            if ((this.keyW.isDown || this.keyUp.isDown) && (this.keyD.isDown || this.keyRight.isDown)) {           // UP RIGHT
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.UpRight;
            } else if ((this.keyW.isDown || this.keyUp.isDown) && (this.keyA.isDown || this.keyLeft.isDown)) {     // UP LEFT
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.UpLeft;
            } else if ((this.keyS.isDown || this.keyDown.isDown) && (this.keyA.isDown || this.keyLeft.isDown)) {   // DOWN LEFT
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.DownLeft;
            } else if ((this.keyS.isDown || this.keyDown.isDown) && (this.keyD.isDown || this.keyRight.isDown)) {  // DOWN RIGHT
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.DownRight;
            } else if (this.keyW.isDown || this.keyUp.isDown) {     // UP
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.Up;
            } else if (this.keyA.isDown || this.keyLeft.isDown) {   // LEFT
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.Left;
            } else if (this.keyS.isDown || this.keyDown.isDown) {   // DOWN
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.Down;
            } else if (this.keyD.isDown || this.keyRight.isDown) {  // RIGHT
                this.scene.tweens.resumeAll();
                return PlayerMoveDirection.Right;
            } else {
                this.scene.tweens.pauseAll();
                return PlayerMoveDirection.None;
            }
        } else {
            return PlayerMoveDirection.None;
        }
    }

    public getMoveUpdateFromInput(id: string, anchor: GameObject): PlayerMoveUpdate {
        // Can't use world x/y because they don't update often enough
        let mouseX = this.mousePointer.x + this.camera.worldView.x;
        let mouseY = this.mousePointer.y + this.camera.worldView.y;
        // Y coordinates are flipped
        let angleFromPlayer = Math.atan2(mouseY - anchor.y, mouseX - anchor.x);

        return new PlayerMoveUpdate(anchor.id, 0, angleFromPlayer, this.mousePointer.active, this.checkDirection(), this.mousePointer.isDown);
    }

}
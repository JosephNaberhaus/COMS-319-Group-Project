import { GameObject } from "./GameObject.js";
import { SCALE_FACTOR } from "../Game.js";
import { ItemObjectDescription } from "../models/objects/Descriptions/ItemObjectDescription.js";
import { ItemPositionUpdate } from "../models/objects/ItemPositionUpdate.js";
import { ToolTip } from "./Tooltip.js";

export class Item extends GameObject {

    private toolTip: ToolTip;


	/**
	 * Constructs a new bullet object
	 * @param givenScene The scene this bullet is to belong to
	 * @param givenDescription The description to create the bullet from
	 */
    constructor(givenScene: Phaser.Scene, givenDescription: ItemObjectDescription) {
        super(givenScene, givenDescription.x * SCALE_FACTOR, givenDescription.y * SCALE_FACTOR, givenDescription.sprite);
        givenScene.physics.world.enable(this);
        this.setScale(0.3, 0.3);//this is probably not the right way to do this.

        //properties
        this.id = givenDescription.id;
        this.body

        //Text
        this.toolTip = new ToolTip(this.scene, {
            x: givenDescription.x * SCALE_FACTOR,
            y: givenDescription.y * SCALE_FACTOR,
            name: "Default",
            tip: "Pickup press p",
            font: "november",
            fontSize: 15
        });


    }

    /**
     * Applies a ItemPositionUpdate
     * @param givenUpdate
     */
    public applyUpdate(givenUpdate: ItemPositionUpdate): void {
        this.setPosition(givenUpdate.x * SCALE_FACTOR, givenUpdate.y * SCALE_FACTOR);
    }
}
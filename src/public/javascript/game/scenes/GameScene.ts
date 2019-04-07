import {Player} from "../objects/Player.js";
import {GameConnection} from "../GameConnection.js";
import {GameObject} from "../objects/GameObject.js";
import {PositionUpdate} from "../../models/game/objects/PositionUpdate.js";
import {UserInput} from "../objects/UserInput.js";
import {NewObjectType, ObjectDescription} from "../../models/game/objects/ObjectDescription.js";
import {PlayerObjectDescription} from "../../models/game/objects/PlayerObjectDescription.js";


export class GameScene extends Phaser.Scene {
    /**
     * The connection to the server
     */
    connection: GameConnection;
    /**
     * The map from id to game object that contains all game objects in the game
     */
    private objects: Map<string, GameObject>;
    /**
     * A reference to the player that this client is playing
     */
    private clientPlayer: Player;
    /**
     * The user input object that will move the player.
     */
    private uInput: UserInput;

    constructor() {
        super({
            key: "GameScene"
        });

        this.objects = new Map<string, GameObject>();
    }

    init(connection: GameConnection): void {
        this.connection = connection;
    }

    create(): void {
        this.add.existing(this.clientPlayer);
        this.objects.set(this.clientPlayer.id, this.clientPlayer);

        this.clientPlayer.setRotation(Math.PI);

        this.uInput = new UserInput(this, this.clientPlayer);
    }

    update(): void {
        // Check for new game objects
        this.connection.newObjects.forEach((object: ObjectDescription) => this.addNewObject(object));

        // Apply updates
        this.objects.forEach((object: GameObject, id: string) => {
            // Apply updates from server
            let tempUpdate: PositionUpdate = this.connection.positionUpdates.popUpdate(id);
            if (tempUpdate != null) {
                object.applyUpdate(tempUpdate);
            }
        });

		// Send the players move to the server
		let moveUpdate = this.uInput.getMoveUpdateFromInput();
		this.connection.sendMove(moveUpdate);
    }

    private addNewObject(newObjectDescription: ObjectDescription) {
        let object: GameObject;
        if (newObjectDescription.type === NewObjectType.Player) {
			object = new Player(this, newObjectDescription as PlayerObjectDescription);
			// Check if the id of this object is the clients, if it is save the reference to it
            this.clientPlayer = object as Player;
        } else {
            throw "Unknown game object type";
        }
        this.objects.set(object.id, object);
    }

}
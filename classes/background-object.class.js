class BackgroundObject extends MoveableObject {

    constructor(imgPath, x) {
        super().loadImage(imgPath);
        this.x = x;
        this.y = 480 - this.height; // Höhe Canvas (480) - Höhe BackgroundObjekt (400)
    }
}
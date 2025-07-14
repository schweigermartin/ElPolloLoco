class BackgroundObject extends MoveableObject {

    width = 720;
    height = 480;
    constructor(imagePath, x){
        super();
        this.loadImage(imagePath);

        this.x = x;
        this.y = 480 - this.height; // Höhe Canvas (480) - höhe BackgrondObjekt (400)


    }
}
class Coin extends MoveableObject {
    height = 50;
    width = 50;
    y = 350;
    
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y = 350) {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_COIN.length;
            let path = this.IMAGES_COIN[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 200);
    }
} 
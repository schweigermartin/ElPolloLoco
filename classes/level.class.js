class Level {
    enemies;
    clouds;
    backgroundobjects;
    coins;
    bottles;
    level_end_x = 700;

    constructor(enemies, clouds, backgroundobjects, coins, bottles){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundobjects = backgroundobjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
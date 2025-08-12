const level1 = new Level(
    [
        new Chicken(800),  // Erstes Huhn erst bei x=800
        new Chicken(1200), // Zweites Huhn bei x=1200
        new Chicken(1600), // Drittes Huhn bei x=1600
        new Chicken(2000), // Viertes Huhn bei x=2000
        new Chicken(2200), // Fünftes Huhn bei x=2200
        new Chicken(2400), // Sechstes Huhn bei x=2400
        new SmallChicken(900),  // Erstes kleines Huhn bei x=900
        new SmallChicken(1400), // Zweites kleines Huhn bei x=1400
        new SmallChicken(1800), // Drittes kleines Huhn bei x=1800
        new SmallChicken(2200), // Viertes kleines Huhn bei x=2200
        new SmallChicken(2600), // Fünftes kleines Huhn bei x=2600
        new Endboss(2800), // Endboss noch weiter hinten bei x=2800
    ],
    [
        new Cloud(),
    ],
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),

        new BackgroundObject('img/5_background/layers/air.png', 719*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3),

        new BackgroundObject('img/5_background/layers/air.png', 719*4),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*4),

        new BackgroundObject('img/5_background/layers/air.png', 719*5),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*5),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*5),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*5),

    ],
    [
        // Reduzierte Anzahl von Münzen - nur wesentliche
        new Coin(600),
        new Coin(1000),
        new Coin(1400),
        new Coin(1800),
        new Coin(2200),
        new Coin(2600),
        
        // Wenige erhöhte Münzen
        new Coin(800, 120),
        new Coin(1200, 130),
        new Coin(1600, 125),
        new Coin(2000, 120),
        new Coin(2400, 130),
    ],
    [
        // Reduzierte Anzahl von Flaschen - strategische Platzierung für Endboss
        new Bottle(500),
        new Bottle(1000),
        new Bottle(1500),
        new Bottle(2000),
        new Bottle(2500),
        
        // Wenige erhöhte Flaschen
        new Bottle(800, 120),
        new Bottle(1200, 125),
        new Bottle(1600, 120),
        new Bottle(2000, 125),
        new Bottle(2400, 120),
    ]
);
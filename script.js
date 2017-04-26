var snake;
var apple;
var snakeGame;


// Window.onload : affichage de la fenêtre
// canvas permet de dessiner
window.onload = function ()
{
    snakeGame = new SnakeGame(900,600,30,100);
    snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");    // Le snake prend un body en paramètre => le body est un array d'arrays, ceux-ci formant les blocs
    apple = new Apple([10,10]);
    snakeGame.init(snake,apple);    // init est une méthode de snakeGame
}


// FLECHES

document.onkeydown = function handleKeyDown(e)     // Gestion de la frappe d'une flèche par l'utilisateur
{
    var key = e.keyCode;    // Récupère le code de la touche qui a été appuyée par l'utilisateur
    var newDirection;
    switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:                    // Touche Espace
                snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");    // Le snake prend un body en paramètre => le body est un array d'arrays, ceux-ci formant les blocs
                apple = new Apple([10,10]);
                snakeGame.init(snake,apple);    // init est une méthode de snakeGame
                return;
            default:    // En cas de problème
                return;
        }
        snakeGame.snake.setDirection(newDirection);  // Le snake fait appel à la nouvelle direction saisie
}


function SnakeGame(canvasWidth, canvasHeight, blockSize, delay)    // Fonction constructeur
{
    this.canvas = document.createElement('canvas');
    //Déclaration des variables globales
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvas.style.border = "1px solid #ffe600";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.blockSize = blockSize; // Le serpent va être constitué de blocs de 30x30 px
    this.delay = delay;   //Temps exprimé en millisecondes
    this.snake;     // Snake devient une propriété du jeu
    this.apple;     // Apple devient une propriété du jeu
    this.widthInBlocks = canvasWidth/blockSize;      // 900/30 = 30 blocks numérotés de 0 à 29
    this.heightInBlocks = canvasHeight/blockSize;    // 600/30 = 20 blocks numérotés de 0 à 19
    this.score;
    var instance = this;        // this est l'instance particulière du jeu que l'on vient de créer avec la fonction SnakeGame
    var timeout;
    
    // METHODES DU JEU
    
    this.init = function(snake, apple)     // Fonction qui permet d'initialiser des choses
    {
        this.snake = snake;
        this.apple = apple;
        this.score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    
    // Apporter du mouvement au rectangle
    var refreshCanvas = function()
    {
        instance.snake.advance();
        if(instance.checkCollision())
            {
                // GAME OVER
                instance.gameOver();
            }
        else
            {
                if(instance.snake.isEatingApple(instance.apple))
                    {
                        instance.score++;
                        instance.snake.ateApple = true;
                        do
                        {
                            instance.apple.setNewPosition(instance.widthInBlocks, instance.heightInBlocks);    // LE SERPENT A MANGé LA POMME
                        }
                        while(instance.apple.isOnSnake(snakee)) // Tant que la pomme est sur le snakee, redonne une nouvelle position à la pomme
                    }
                instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);  // Efface le rectangle chaque seconde pour ensuite afficher sa nouvelle position
                instance.snake.draw(instance.ctx, instance.blockSize);  // Dessin du serpent
                instance.apple.draw(instance.ctx, instance.blockSize);
                instance.drawScore();
                timeout = setTimeout(refreshCanvas, delay);  // Fonction qui permet de dire "Exécute la fonction à chaque fois que le délai défini dans la variable en paramètre (delay ici) est passé

                // ctx.fillRect(30, 30, 100, 50);  // 30 et 30 sont les distances x et y à partir desquelles on écrit, 100 et 50 sont les dimensions du rectangle (largeur et hauteur)
            }
    }
        
    this.checkCollision = function()        // Vérifie si le snake touche le bord du canvas ou lui-même
    {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.snake.body[0];        // Tête = premier élément du corps du serpent => index 0 du body
            var rest = this.snake.body.slice(1);  // Passe sur la valeur 0 dans l'array body, garde le reste
            var snakeX = head[0]            // Coordonnées x de la tête
            var snakeY = head[1]            // Coordonnées y de la tête
            var minX = 0;
            var minY = 0;
            var maxX = this.widthInBlocks - 1;
            var maxY = this.heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

        if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)    // Check si collision du serpent avec un mur
            {
                wallCollision = true;
            }

        for(var i = 0; i < rest.length; i++)    // Check si collision du serpent avec lui-même
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1]) // Si le x ET le y de la tête sont sur les mêmes x et y qu'un bloc du reste du corps, alors il y a collision
                    {
                        snakeCollision = true;
                    }
            }
        return wallCollision || snakeCollision;     // Si collision quelconque, la fonction checkCollision renvoie false

    };
    
    this.gameOver = function()
    {
        this.ctx.save();     // Enregistrement du contexte avant d'appliquer les changements
        this.ctx.font = "bold 15px EYInterstate";
        var messages = ["grosse ch\350vre",
                        "chenille malade",
                        "trilobite an\351mique",
                        "anthropopith\350que",
                        "moule \340 gaufres",
                        "coprolithe",
                        "nodoc\351phale",
                        "coureuse de rempart",
                        "gourgandine",
                        "t'es mauvais Jack"];
        j = Math.floor(Math.random() * 10) + 0   // Le premier chiffre est le nombre de possibilités, le deuxième la valeur de départ
        this.ctx.fillText("Game over, " + messages[j] +" !", 5, 20);    // Il suffit de remplacer les caractères accentués par leur équivalent en octal précédé de \ (anti-slash)
                                                                // Table des équivalences en octal / hex / html : http://www.pjb.com.au/comp/diacritics.html
        this.ctx.font = "bold italic 10px EYInterstate";
        this.ctx.fillText("Appuyer sur Espace pour rejouer.", 5, 50);
        this.ctx.restore();  // Restauration du contexte sauvegardé
    };

    this.drawScore = function()
    {
        this.ctx.save();     // Enregistrement du contexte avant d'appliquer les changements
        this.ctx.font = "bold 15px EYInterstate";
        this.ctx.fillText(this.score.toString(), 5, this.canvas.height - 5);
        this.ctx.restore();  // Restauration du contexte sauvegardé
    };
        
}

    
// SNAKE //
    
function Snake(body, direction)     // Fonction constructeur => c'est un prototype
{
    this.body = body;
    this.direction = direction;     // Direction du snake, en paramètre du constructeur Snake
    this.ateApple = false;
    this.draw = function(ctx,blockSize)          // Fonction pour dessiner le snake
        {
            ctx.save();
            ctx.fillStyle = "#ffe600";  // Jaune EY
            for(var i = 0; i < this.body.length; i++)
                {
                    var x = this.body[i][0] * blockSize;
                    var y = this.body[i][1] * blockSize;
                    ctx.fillRect(x, y, blockSize, blockSize);
                }
            ctx.restore();  // Permet de dessiner sur le contexte puis de le remettre comme il était avant

        }
    this.advance = function()   // Fonction pour faire avancer le serpent
        {
            var nextPosition = this.body[0].slice();    // Au début, body[0] correspond à l'array [6,4] (cf. ligne 23)
//                  nextPosition[0]++;      // Par défaut, le snake va à droite en incrémentant son x de 1
//                  nextPosition[1]--;      // Par défaut, le snake va en haut en incrémentant son y de 1

            // Définir les directions du snake
            switch(this.direction)
                {
                    case "left":
                        nextPosition[0]--; 
                        break;
                    case "right":
                        nextPosition[0]++;
                        break;
                    case "down":
                        nextPosition[1]++;
                        break;
                    case "up":
                        nextPosition[1]--;
                        break;
                    default:
                        throw("Invalid direction");
                }
            this.body.unshift(nextPosition);    // unshift permet de rajouter un élément en première position d'un array
                                                // A la première itération, le array du Snake sera donc : Snake([[7,4],[6,4],[5,4],[4,4]])
            if(!this.ateApple)          // Si le serpent n'a pas mangé une pomme ('!' = 'not'), supprimer le dernier bloc du corps
                this.body.pop();                // Permet de supprimer le dernier block du Snake, pour le faire avancer après avoir ajouté un block à l'avant.
            else
                this.ateApple = false;
        };
    this.setDirection = function(newDirection)      // Fonction pour changer la direction du serpent
                                                    // newDirection est un array
        {
            var allowedDirections;
            switch(this.direction)
                {
                    case "left":
                    case "right":
                        allowedDirections = ["up", "down"];  // Si left ou right, la valeur retournée sera -1
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left", "right"];     // Si up ou down, la valeur retournée sera -1
                        break;
                    default:    // En cas de problème
                        throw("Invalid direction");
                }
            if(allowedDirections.indexOf(newDirection) > -1)    // Si l'index de ma nouvelle direction est > -1, alors elle est permise
                {
                    this.direction = newDirection;
                }
        };

    this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            // Si le x de la tête correspond au x de la pomme ET si idem pour le y
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;        // Pas besoin de {} si une seule ligne dans le if/else
            else
                return false;
        };

}    

    
// POMME
    
function Apple(position)     // Fonction constructeur => c'est un prototype
{
    this.position = position;
    this.draw = function(ctx,blockSize)
    {
/*          ctx.save();                     // Save sauve le contexte
        ctx.fillStyle = "#33cc33";      // Autres dessin de la pomme
        ctx.restore();                  // Restore restaure le contexte sauvegardé, après dessin de la pomme
*/
        ctx.save();                     // Save sauve le contexte
        ctx.fillStyle = "#7f7e82";      // Autre dessin de la pomme
        ctx.beginPath();
        var radius = blockSize/2;       // Rayon de la pomme
        var x = this.position[0] * blockSize + radius;   // Position horizontale de la pomme
        var y = this.position[1] * blockSize + radius;   // Position verticale de la pomme
        ctx.arc(x, y, radius, 0, Math.PI*2, true);    // Dessin du cercle
        ctx.fill();
        ctx.restore();                  // Restore restaure le contexte sauvegardé, après dessin de la pomme
    };
    this.setNewPosition = function(widthInBlocks, heightInBlocks)    // Si la pomme est mangée, changer sa position
    {
        var newX = Math.round(Math.random() * (widthInBlocks -1));  // Va donner un nombre entre 0 et 29
        var newY = Math.round(Math.random() * (heightInBlocks -1)); // Va donner un nombre entre 0 et 19
        this.position = [newX, newY];
    };
    this.isOnSnake = function(snakeToCheck)
    {
        var isOnSnake = false;
        for(var i = 0 ; i < snakeToCheck.body.length; i++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])    // Si le x et le y du snake sont identiques à ceux de la pomme... 
                    {
                        isOnSnake = true;
                    }
            }
            return isOnSnake;
    };
}



















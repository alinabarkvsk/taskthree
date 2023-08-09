const args = process.argv.slice(2);
const readline = require('readline');
const crypto = require('crypto');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generateKey = () => {
    return crypto.randomBytes(32).toString('hex');
}
const generateHmac = (key, move) => {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(move);
    return hmac.digest('hex');
}
const game = (pcMove, key) => {
    rl.question('Enter your move: ', (answer) => {
        switch (true) {
            case answer === '?': {
                console.log(generateHelpTable());
                startGame();
                break;
            }
            case answer === '0' : {
                console.log('Exit');
                rl.close();
                break;
            }
            case answer > 0 && answer <= args.length: {
                const userMove = args[answer - 1];
                console.log('Your move: ' + userMove);
                console.log('Computer move: ' + pcMove);
                console.log(gameRules(userMove, pcMove));
                console.log("HMAC key: " + key)
                console.log('-----------------------------------------------------------------------------')
                console.log('-----------------------------------------------------------------------------')
                startGame();
                break;
            }
            default: {
                console.log('Incorrect input');
                startGame();
                break;
            }
        }
    });
}

const gameRules = (userMove, pcMove) => {
    let half = Math.floor(args.length / 2);
    let userMoveIndex = args.indexOf(userMove);
    let pcMoveIndex = args.indexOf(pcMove);
    if (userMoveIndex === pcMoveIndex) {
        return 'Draw';
    }
    else if (userMoveIndex < pcMoveIndex) {
        if (pcMoveIndex - userMoveIndex <= half) {
            return 'Win';
        }
        else {
            return 'Lose';
        }
    }
    else if (userMoveIndex - pcMoveIndex <= half) {
        return 'Lose';
    }
    else {
        return 'Win';
    }

}


const generateHelpTable = () => {
    let table = [['Move>', ... args]];
    for (let i = 0; i <= args.length - 1; i++){
        const row = [args[i]];
        for (let j = 0; j <= args.length - 1; j++){
            row.push(gameRules(args[i], args[j]));
        }
        table.push(row);
    }
    return table;
}


const startGame = () => {
    const pcMove = args[Math.floor(Math.random() * args.length)];
    const key = generateKey();
    const hmac = generateHmac( key, pcMove);
    console.log('HMAC: ' + hmac);
    console.log('Available moves: ');
    args.forEach((file, index) => {
        console.log(`${index + 1} - ${file}`);
    });
    console.log('0 - Exit');
    console.log('? - Help');
    game(pcMove, key);
}

const init = () => {
    if (args.length < 3) {
        console.log('Less than 3 parameters entered. Enter 3 or more arguments');
        rl.close();
    } else if (new Set(args).size !== args.length) {
        console.log('Duplicate arguments introduced. Please enter unique arguments.');
        rl.close();
    } else if (args.length % 2 === 0) {
        console.log('Enter an odd number of arguments');
        rl.close();
    } else {
        startGame();
    }
}

init();

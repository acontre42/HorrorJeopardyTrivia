"use strict";
import Trivia from './categories/scream.json' with {type: "json"};
import {setUpBoard, removeSplashScreenTimer} from './board.js';

removeSplashScreenTimer(4600);
setUpBoard(Trivia, 'I like that ending.');
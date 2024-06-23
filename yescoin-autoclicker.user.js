// ==UserScript==
// @name         YesCoin Autoclicker
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Автоматический сборщик монет для YesCoin
// @match        *://*.yescoin.gold/*
// @author       mudachyo
// @icon         https://www.yescoin.gold/android-chrome-512x512.png
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/mudachyo/Yescoin/raw/main/yescoin-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/Yescoin/raw/main/yescoin-autoclicker.user.js
// @homepage     https://github.com/mudachyo/Yescoin
// ==/UserScript==

const styles = {
    success: 'background: #28a745; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    starting: 'background: #8640ff; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    error: 'background: #dc3545; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    info: 'background: #007bff; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
};

const logPrefix = '%c[YesCoinBot] ';
const originalLog = console.log;
console.log = function () {
    if (typeof arguments[0] === 'string' && arguments[0].includes('[YesCoinBot]')) {
        originalLog.apply(console, arguments);
    }
};

console.error = console.warn = console.info = console.debug = () => {};

console.clear();
console.log(`${logPrefix}Starting`, styles.starting);
console.log(`${logPrefix}Created by https://t.me/mudachyo`, styles.starting);
console.log(`${logPrefix}Github https://github.com/mudachyo/YesCoin`, styles.starting);

const waitForElement = (selector, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const intervalTime = 100;
        let timeElapsed = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (timeElapsed >= timeout) {
                clearInterval(interval);
                reject(new Error('Element not found'));
            }
            timeElapsed += intervalTime;
        }, intervalTime);
    });
};

const initializeScript = async () => {
    try {
        const container = await waitForElement('#coin-swipe-wrapper');
        console.log(`${logPrefix}Container found`, styles.success);

        const canvas = await waitForElement('#coin-swipe-wrapper canvas.sketch');
        console.log(`${logPrefix}Canvas found`, styles.success);

        const createMouseEvent = (type, x, y) => new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y
        });

        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const getRandomCoordinates = () => ({
            x: Math.random() * width + rect.left,
            y: Math.random() * height + rect.top
        });

        const getEnergyValue = () => {
            const energyElement = document.querySelector('.progress-value');
            return energyElement ? parseInt(energyElement.textContent, 10) : 0;
        };

        const moveMouse = () => {
            if (getEnergyValue() < 25) {
                const pauseDuration = Math.random() * 30 + 30;
                console.log(`${logPrefix}Energy < 25, pausing for ${pauseDuration} seconds`, styles.info);
                setTimeout(moveMouse, pauseDuration * 1000);
                return;
            }

            const numMoves = 10;
            for (let i = 0; i < numMoves; i++) {
                const { x, y } = getRandomCoordinates();
                canvas.dispatchEvent(createMouseEvent('mousemove', x, y));
            }

            requestAnimationFrame(moveMouse);
        };

        moveMouse();

    } catch (error) {
        console.log(`${logPrefix}Error in YesCoin Collector script: ${error.message}`, styles.error);
    }
};

setTimeout(initializeScript, 3000);
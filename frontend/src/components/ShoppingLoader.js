import React, { useEffect, useState } from 'react';

const shoppingEmojis = ['🛒', '📦', '💳', '🧾', '🎁', '🏷️', '🚚', '📬', '🛍️', '🧃', '🍕', '💼'];

const ShoppingLoader = () => {
    const [phase, setPhase] = useState('orbit'); // orbit → gather → disperse
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        let timers = [];

        if (phase === 'orbit') {
            timers.push(setTimeout(() => {
                setPhase('gather');
                setActiveIndex(0);
            }, 1500));
        }

        if (phase === 'gather') {
            const interval = setInterval(() => {
                setActiveIndex((prev) => {
                    if (prev < shoppingEmojis.length - 1) return prev + 1;
                    clearInterval(interval);
                    timers.push(setTimeout(() => {
                        setPhase('disperse');
                        setActiveIndex(shoppingEmojis.length - 1);
                    }, 800));
                    return prev;
                });
            }, 150);
            timers.push(interval);
        }

        if (phase === 'disperse') {
            const interval = setInterval(() => {
                setActiveIndex((prev) => {
                    if (prev > 0) return prev - 1;
                    clearInterval(interval);
                    timers.push(setTimeout(() => {
                        setPhase('orbit');
                    }, 800));
                    return prev;
                });
            }, 150);
            timers.push(interval);
        }

        return () => timers.forEach(clearTimeout);
    }, [phase]);

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                backdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.05)',
                zIndex: 9999,
            }}
        >
            <div className="position-relative" style={{ width: '300px', height: '300px' }}>
                {shoppingEmojis.map((emoji, index) => {
                    const angle = (360 / shoppingEmojis.length) * index;
                    const radius = 140;

                    const isGathered = phase === 'gather' && index <= activeIndex;
                    const isDispersed = phase === 'disperse' && index < activeIndex;
                    const inCenter = isGathered || isDispersed;

                    const orbitAnimation = `emojiOrbit${index}`;

                    return (
                        <div
                            key={index}
                            className="position-absolute"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: inCenter
                                    ? 'translate(-50%, -50%)'
                                    : `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                                transition: 'transform 0.6s ease',
                                animation:
                                    phase === 'orbit' && !inCenter
                                        ? `${orbitAnimation} 4s linear infinite`
                                        : 'none',
                            }}
                        >
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{
                                    fontSize: '2rem',
                                    opacity: 0.85,
                                    width: '2.5rem',
                                    height: '2.5rem',
                                }}
                            >
                                {emoji}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>
                {shoppingEmojis
                    .map((_, i) => {
                        const angle = (360 / shoppingEmojis.length) * i;
                        return `
              @keyframes emojiOrbit${i} {
                0% { transform: rotate(${angle}deg) translate(140px) rotate(-${angle}deg); }
                100% { transform: rotate(${angle + 360}deg) translate(140px) rotate(-${angle + 360}deg); }
              }
            `;
                    })
                    .join('\n')}
            </style>
        </div>
    );
};

export default ShoppingLoader;

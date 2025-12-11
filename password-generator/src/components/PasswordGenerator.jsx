import React, { useState, useEffect, useRef } from "react";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import zxcvbn from "zxcvbn";
import {
    generatePassword,
    calculateEntropy
} from "../utils/passwordUtils";
import deviceImage from "../assets/device.png";

const DEFAULT_LENGTH = 8;

export default function PasswordGenerator() {
    const [length, setLength] = useState(DEFAULT_LENGTH);
    const [useUpper, setUseUpper] = useState(true);
    const [useLower, setUseLower] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(false);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);
    const [strength, setStrength] = useState({ score: 0, label: "Weak" });
    const inputRef = useRef(null);

    const regen = (opts) => {
        const p = generatePassword(opts);
        setPassword(p);
    };

    useEffect(() => {
        regen({
            length,
            useUpper,
            useLower,
            useNumbers,
            useSymbols
        });
    }, [length, useUpper, useLower, useNumbers, useSymbols]);

    useEffect(() => {
        if (!password) return;
        const res = zxcvbn(password);
        const score = res.score; // 0-4
        const labels = ["Very weak", "Weak", "Okay", "Strong", "Very strong"];
        setStrength({ score, label: labels[score] });
    }, [password]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            // fallback: select & execCopy
            if (inputRef.current) {
                inputRef.current.select();
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }
        }
    };

    return (
        <div className="container">
            <div className="left">
                <img src={deviceImage} alt="device image" className="deviceImage" />
            </div>

            <div className="right">
                <h1 className="title">Random Password Generator</h1>
                <p className="subtitle">
                    Instantly create strong and secure passwords to keep your account safe online.
                </p>

                <div className="generatorCard">
                    <div className="outputRow">
                        <input
                            ref={inputRef}
                            className="passwordField"
                            value={password}
                            readOnly
                            aria-label="generated password"
                        />
                        <div className={`strengthBadge ${strength.score >= 3 ? "strong" : ""}`}>
                            {strength.label}
                        </div>
                        <button className="iconBtn" onClick={() => regen({ length, useUpper, useLower, useNumbers, useSymbols })} title="Regenerate">
                            <FiRefreshCw />
                        </button>
                        <button className="copyBtn" onClick={copyToClipboard}>
                            {copied ? "Copied" : <><FiCopy /> <span className="copyText">Copy</span></>}
                        </button>
                    </div>

                    <div className="controls">
                        <div className="controlRow">
                            <label className="label">Password length: <strong>{length}</strong></label>
                            <div className="sliderWrap">
                                <button className="roundBtn" onClick={() => setLength((l) => Math.max(4, l - 1))}>−</button>
                                <input
                                    type="range"
                                    min="4"
                                    max="20"
                                    value={length}
                                    onChange={(e) => setLength(Number(e.target.value))}
                                    className="slider"
                                />
                                <button className="roundBtn" onClick={() => setLength((l) => Math.min(64, l + 1))}>+</button>
                            </div>
                        </div>

                        <div className="controlRow">
                            <label className="label">Characters used:</label>
                            <div className="toggles">
                                <label className="toggle">
                                    <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
                                    <span>ABC</span>
                                </label>

                                <label className="toggle">
                                    <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} />
                                    <span>abc</span>
                                </label>

                                <label className="toggle">
                                    <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
                                    <span>123</span>
                                </label>

                                <label className="toggle">
                                    <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
                                    <span># $ &</span>
                                </label>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    );
}

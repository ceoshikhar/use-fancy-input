import React from "react";
import styles from "./FancyInput.module.css";

interface Props {
    length: number;
}

export const FancyInput = ({ length }: Props): JSX.Element => {
    return (
        <div className={styles.red}>
            <h3>FancyInput</h3>
            <p>{length}</p>
        </div>
    );
};

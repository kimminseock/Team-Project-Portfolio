import React from 'react';

export const nl2brReact = (str) => {
    if (!str) return null;
    return str.split(/\r?\n/).map((line, index) =>
        (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
}
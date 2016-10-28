import * as React from "react";
import { Link } from 'react-router';

export class IntroView extends React.Component<{}, {}> {
    componentDidMount() {
        this.animateTitle();
    }

    animateTitle() {
        let title = document.querySelector('.title');

        return setInterval(() => {
            title.classList.remove('flicker');
            setTimeout(() => {
                title.classList.add('flicker');
            }, 500)
        }, 2250)
    }

    render() {
        return (
            <div>
                <h1 className="title flicker">snake</h1>
                <menu className="menu">
                    <Link to="/snake" className="menu__item">Start</Link>
                </menu>
            </div>
        );
    }
}
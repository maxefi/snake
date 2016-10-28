import * as React from 'react';

export class HomeView extends React.Component<{}, {}> {
    componentDidMount() {
        this.RandomSnakeIntro();
    }

    RandomSnakeIntro() {
        function getRandomPositionLeft() {
            let container = document.querySelector('.wrapper') as HTMLElement;
            let containerWidth = container.offsetWidth;

            return (Math.floor(Math.random() * (containerWidth - 250 ))) + 'px';
        };

        function getRandomPositionTop() {
            let container = document.querySelector('.wrapper') as HTMLElement;
            let containerHeight = container.offsetHeight;

            return (Math.floor(Math.random() * (containerHeight - 110))) + 'px';
        };

        function getRandomSnakeClassName() {
            return 'snake-' + (Math.floor(Math.random() * 17));
        }

        function createNewSnake() {
            let container = document.querySelector('.wrapper');

            setInterval(() => {
                let newDiv = document.createElement('div');
                let firstChild = container.firstChild;
                const randomSnakeClassName = getRandomSnakeClassName();

                container.insertBefore(newDiv, firstChild);

                container.querySelector('div').className = randomSnakeClassName;
                const randomSnakeElement = container.querySelector('.' + randomSnakeClassName) as HTMLElement;

                randomSnakeElement.style.top = getRandomPositionTop();
                randomSnakeElement.style.left = getRandomPositionLeft();
            }, 2500)
        }

        return createNewSnake();
    }

    render() {
        return (
            <div className='home-container'>
                {this.props.children}
            </div>
        )
    }
}

import * as React from "react";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import {GameView} from "./GameView";
import {IntroView} from "./IntroView";
import {HomeView} from "./HomeView";

export const routes = (
    <Router history={hashHistory}>
        <Route path='/' component={HomeView}>
            <IndexRoute path='/' component={IntroView}/>
            <Route path='snake' component={GameView}/>
        </Route>
    </Router>
);
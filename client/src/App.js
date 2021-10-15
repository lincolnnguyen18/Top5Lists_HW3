import './App.css';
import { React, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, Statusbar, Workspace, DeleteModal } from './components'
import { GlobalStoreContext } from './store'

/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    const { store } = useContext(GlobalStoreContext);

    return (
        <Router>
            <Banner />
            <Switch>
                <Route path="/" exact component={ListSelector} />
                <Route path="/top5list/:id" exact component={Workspace} />
            </Switch>
            <Statusbar />
            <DeleteModal />
        </Router>
    )
}

export default App
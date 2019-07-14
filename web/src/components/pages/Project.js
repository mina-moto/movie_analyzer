import React from 'react';

import PropTypes from 'prop-types';

import request from 'superagent';

import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {};

//プロジェクト選択
class Project extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            analyze_list: []
        };

        this.props.dispatchHeaderTitle("一覧");
    }

    componentDidMount() {
        request.get("/api/analyze_list").then(res => {
            this.setState({analyze_list: res.body.analyze_list});
        }).catch(err => this.props.dispatchSnackBarMessage("Error: " + err.message));
    }

    onItemClick(e, item) {
        e.preventDefault();
        this.props.history.push(`/data/${item}/`);
    }

    render() {
        const {classes} = this.props;
        const {analyze_list} = this.state;
        // analyze_listに基づくプロジェクト名を入手
        return (<Grid container="container" spacing={24}>
            <Grid item="item" xs={12}>
                <List className={classes.list} subheader={<li />}>
                    <li key={`section`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            {
                                analyze_list.map(item => (<ListItem button="button" key={item} onClick={e => this.onItemClick(e, item)}>
                                    <ListItemText primary={item}/>
                                </ListItem>))
                            }
                        </ul>
                    </li>
                </List>
            </Grid>
        </Grid>);
    }
}

Project.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Project);

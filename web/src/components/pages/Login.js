import React from 'react';

import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import TedImage from '../../images/ted.svg'
import sample_scatter from '../../images/sample_scatter.png'

const styles = {
    pad4: {
        paddingTop: "2rem"
    },
    centering: {
        paddingTop: "2rem",
        display: "flex",
        justifyContent: "center"
    }
};

class Login extends React.Component {

    componentDidMount() {
        this.props.dispatchHeaderTitle("");
    }

    onStartClick(e) {
        e.preventDefault();
        // プロジェクト一覧へ
        this.props.history.push("/data/");
    }

    render() {
        const {classes} = this.props;
        return (<div>
            <Typography variant="display1" gutterBottom="gutterBottom" align="center" className={classes.pad4}>
                Movie ANALYZER
            </Typography>
            <div className={classes.centering}>
                <img src={sample_scatter} alt="sample_scatter"/>
            </div>
            <Typography variant="headline" gutterBottom="gutterBottom" align="center" className={classes.pad4}>
                Visualization of Electric power data by Tsne.
                説明
            </Typography>
            <div className={classes.centering}>
                <Button variant="contained" color="primary" className={classes.button} onClick={e => this.onStartClick(e)}>
                    START!
                </Button>
            </div>
        </div>);
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);

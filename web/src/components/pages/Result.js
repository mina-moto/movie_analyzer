import React from 'react';

import PropTypes from 'prop-types';

import request from 'superagent';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const styles = {
};


class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resultId: props.match.params.id,
      listItem: []
    };

    this.props.dispatchHeaderTitle(this.state.resultId);
  }

  componentDidMount() {
    request
      .get("/api/code_list")
      .query({ id: this.state.resultId })
      .then(res => {
        this.setState({ listItem: res.body.listItem });
      })
      .catch(err => this.props.dispatchSnackBarMessage("Error: " + err.message));
  }

  onItemClick(e, item) {
    e.preventDefault();
    this.props.history.push(`/data/${this.state.resultId}/${item}/`);
  }

  render() {
    const { classes } = this.props;
    const { listItem } = this.state;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <List className={classes.list} subheader={<li />}>
            <li key={`section`} className={classes.listSection}>
              <ul className={classes.ul}>
                {listItem.map(item => (
                  <ListItem button key={item} onClick={ e => this.onItemClick(e, item) }>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </ul>
            </li>
          </List>
        </Grid>
      </Grid>
    );
  }
}


Result.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Result);

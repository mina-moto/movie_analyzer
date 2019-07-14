import React from 'react';

import request from 'superagent';

import {Scatter} from 'react-chartjs-2';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import SyntaxHighlighter, {registerLanguage} from "react-syntax-highlighter/prism-light";
import java from 'react-syntax-highlighter/languages/prism/java';
import {vs as PrismVs} from 'react-syntax-highlighter/styles/prism';

const styles = {
    result: {
        alignItems: "stretch",
        height: "80vh"
    },
    chartProgress: {
        position: "absolute",
        top: "45%",
        left: "40%"
    }
};

const options = {
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 3,
            pointStyle: "circle",
            backgroundColor: "rgba(75,192,192,0.8)",
            borderWidth: 1,
            borderColor: "rgba(215,252,240,1)",
            hitRadius: 10,
            hoverRadius: 6,
            hoverBorderWidth: 4
        }
    },
    // 点にカーソル合わせた時の処理
    tooltips: {
        callbacks: {
            label: function(tooltipItems, data) {
                let dataList = data.datasets[tooltipItems.datasetIndex].data;
                let itemLabel;
                for (let i = 0; i < dataList.length; i++) {
                    let item = dataList[i];
                    if (item.x === tooltipItems.xLabel && item.y === tooltipItems.yLabel) {
                        itemLabel = item.l;
                    }
                }
                return itemLabel !== undefined
                    ? itemLabel
                    : "unknown";
            }
        }
    }

};

class ResultChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 表示するresultのプロジェクト(上映中など)
            resultId: props.match.params.id,
            chartData: {
                datasets: [
                    {
                        label: "",
                        data: []
                    }
                ]
            },
            listItem: [],
            movie_title: "",
            summary_text: "",
            isDialogOpen: false,
            loadingChart: true
        };

        this.props.dispatchHeaderTitle(props.match.params.id);
        // this.props.dispatchHeaderTitle("上映中");
    }

    // クリックした点の映画の情報
    onElementsClick = (elem) => {
        if (elem.length !== 0) {
            let data = this.state.chartData.datasets[0].data[elem[0]._index];
            this.setState({listItem: data.l.split("\n")});
        }
    }

    //映画のあらすじ開く
    onListItemClick = (e, item) => {
        e.preventDefault();

        request.get("/api/summary")
        //.query({ id: this.state.resultId, name: item, filename: this.state.fileName })
            .query({id: this.state.resultId, title: item}).then(res => {
            this.setState({movie_title: item, summary_text: res.text, isDialogOpen: true});
        }).catch(err => this.props.dispatchSnackBarMessage("Error: " + err.message));
    }

    handleCloseDialog = (e) => {
        e.preventDefault();
        this.setState({isDialogOpen: false});
    }

    componentDidMount() {
        request.get("/api/result")
            .query({id: this.state.resultId}).then(res => {
            if (res.status === 200) {
                this.setState({chartData: res.body.chartData, loadingChart: false});
            } else if (res.status === 202) {
                this.props.dispatchSnackBarMessage("Info: " + res.text);
            }
        }).catch(err => this.props.dispatchSnackBarMessage("Error: " + err.message));
    }

    render() {
        const {classes} = this.props;
        const {
            chartData,
            listItem,
            movie_title,
            summary_text,
            isDialogOpen,
            loadingChart
        } = this.state;
        return (<Grid container="container" spacing={24} className={classes.result}>
            <Grid item="item" xs={12} sm={9}>
                <Scatter data={chartData} options={options} width={600} height={400} onElementsClick={this.onElementsClick}/>
                {loadingChart && <CircularProgress size={64} thickness={2} className={classes.chartProgress}/>}
            </Grid>
            <Grid item="item" xs={12} sm={3}>
                <List className={classes.list} subheader={<li />}>
                    <li key={`section`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            {
                                listItem.map(item => (<ListItem button="button" key={item} onClick={e => {
                                        this.onListItemClick(e, item);
                                    }}>
                                    <ListItemText primary={item}/>
                                </ListItem>))
                            }
                        </ul>
                    </li>
                </List>
            </Grid>

            <div className="summary_dialog">
                <Dialog open={isDialogOpen} onClose={this.handleCloseDialog} aria-labelledby="text-dialog-title">
                    <DialogTitle id="text-dialog-title">{movie_title}</DialogTitle>
                    <DialogContent>
                        {summary_text}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Grid>);
    }
}

ResultChart.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultChart);

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import FolderOpenTwoToneIcon from '@material-ui/icons/FolderOpenTwoTone';
import FolderSpecialTwoToneIcon from '@material-ui/icons/FolderSpecialTwoTone';
import Box from '@material-ui/core/Box';

const useTreeItemStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.secondary,
        '&:focus > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
    },
    rootSelected: {
        '& > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));

const StyledTreeItem = (props) => {
    const classes = useTreeItemStyles();
    const {
        selected, labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other
    } = props;

    return (
        <TreeItem
            label={(
                <div className={classes.labelRoot}>
                    <LabelIcon color="inherit" className={classes.labelIcon} />
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            )}
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: selected ? classes.rootSelected : classes.root,
                content: classes.content,
                expanded: classes.expanded,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
};

StyledTreeItem.propTypes = {
    selected: PropTypes.bool,
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

StyledTreeItem.defaultProps = {
    selected: PropTypes.false,
    bgColor: '#D5E7F3',
    color: '#248FD8',
    labelInfo: '',
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: '100%',
    },
    info: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        fontWeight: 'bold',
    },
});

const FolderTreeView = () => {
    const classes = useStyles();

    return (
        <>
            <Box className={classes.info}>
                <p>LIBRARY</p>
            </Box>
            <TreeView
                className={classes.root}
                defaultExpanded={['3']}
                defaultCollapseIcon={<ArrowDropDownIcon />}
                defaultExpandIcon={<ArrowRightIcon />}
                defaultEndIcon={<div style={{ width: 24 }} />}
            >
                <StyledTreeItem selected nodeId="3" labelText="File & Folders" labelIcon={FolderOpenTwoToneIcon}>
                    <StyledTreeItem
                        nodeId="4"
                        labelText="Images"
                        labelIcon={FolderOpenTwoToneIcon}
                    />
                    <StyledTreeItem
                        nodeId="5"
                        labelText="Videos"
                        labelIcon={FolderOpenTwoToneIcon}
                    />
                    <StyledTreeItem
                        nodeId="6"
                        labelText="Public"
                        labelIcon={FolderSpecialTwoToneIcon}
                    />
                </StyledTreeItem>
            </TreeView>
            <Box className={classes.info}>
                <p>QUICK ACCESS</p>
            </Box>
            <TreeView
                className={classes.root}
                defaultCollapseIcon={<ArrowDropDownIcon />}
                defaultExpandIcon={<ArrowRightIcon />}
                defaultEndIcon={<div style={{ width: 24 }} />}
            >
                <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
                <StyledTreeItem nodeId="1" labelText="All files" labelIcon={AllInclusiveIcon} />
            </TreeView>
        </>
    );
};

export default FolderTreeView;

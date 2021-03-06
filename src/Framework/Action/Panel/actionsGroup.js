import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus } from '@fortawesome/fontawesome-free-solid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Actions from './Action/actions';

const ActionsGroup = ({ changeModalVisibility, actionName, actionKey, visibility, contextMenu, pullDown }) => (
    <div style={styles.main} >
        <div id={actionKey} style={styles.figure} onContextMenu={contextMenu}>
            <FontAwesomeIcon icon={faChevronDown} style={{ ...styles.pullDown, transform: visibility ? 'rotate(0deg)' : 'rotate(-90deg)' }} onClick={event => pullDown({ event, visibility, actionKey })} role="presentation" />
            <div style={{ display: 'flex', alignItems: 'center', width: '80%', color: '#888', fontSize: 16, cursor: 'pointer', fontWeight: 'bold', marginLeft: 10 }}>
                {actionName}
            </div>
            <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesomeIcon id={`${actionName}addAction`} icon={faPlus} style={{ fontSize: 16, color: '#aaa', cursor: 'pointer', transition: 'all 0.1s ease-in-out' }} onMouseDown={changeModalVisibility({ viewMode: actionKey })} />
            </div>
        </div>
        <Actions actionKey={actionKey} />
    </div>
);

ActionsGroup.propTypes = {
    actionKey: PropTypes.string.isRequired,
    actionName: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    contextMenu: PropTypes.func.isRequired,
    pullDown: PropTypes.func.isRequired,
    changeModalVisibility: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    figure: {
        width: '100%',
        height: 43,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'all 0.3s ease-out',
    },
    pullDown: {
        width: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
        fontSize: 16,
        cursor: 'pointer',
        color: '#aaa',
        transition: 'all 0.4s ease-out',
    },
    title: {
        marginLeft: 10,
        border: 'none',
        backgroundColor: 'transparent',
        color: '#888',
        fontSize: 16,
        cursor: 'pointer',
        textAlign: 'text',
        fontWeight: 'bold',
    },
};

const mapStateToProps = (state, ownProps) => ({
    visibility: state.getIn(['action', 'actionSequence', ownProps.actionKey, 'panelVisibility']),
});

const mapDispatchToProps = (dispatch, ownProps) => {
    const mouseupListener = () => {
        document.getElementById(`${ownProps.actionName}addAction`).style.fontSize = 16;
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        changeModalVisibility: ({ viewMode }) => () => {
            document.getElementById(`${ownProps.actionName}addAction`).style.fontSize = 10;
            document.addEventListener('mouseup', mouseupListener, true);
            dispatch({
                type: 'ACTION_MODAL_VISIBILITY',
                viewMode,
            });
        },
        contextMenu: () => {
            dispatch({
                type: 'FIGURE_TIPS',
                figureId: ownProps.figureId,
                target: 'figure',
            });
        },
        pullDown: ({ event, visibility, actionKey }) => { // 执行动画
            dispatch({
                type: 'ACTION_PANEL_VISIBILITY',
                actionKey,
                visibility: !visibility,
            });
            event.preventDefault();
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsGroup);

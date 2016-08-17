import 'styles/suggestionList.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getSuggestionList } from '../reducers/';
import { changeSelectedSuggestion, hideSuggestions, useSuggestion } from '../actions';

class SuggestionList extends Component {

    componentWillMount() {
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleClickWindow = this.handleClickWindow.bind(this);

        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('click', this.handleClickWindow);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('click', this.handleClickWindow);
    }

    handleClickWindow() {
        const { hideSuggestions } = this.props;
        // clicks on suggestions stop event bubbling
        // thus, if we catch a window click, it is always outside of the suggestion list
        hideSuggestions();
    }

    handleKeydown(event) {
        const {
            suggestions, selectedIndex, forQueryPart,
            changeSelectedSuggestion, hideSuggestions, useSuggestion
        } = this.props;

        const selectedSuggestion = suggestions[selectedIndex];

        if (event.keyCode == '38') { // up
            changeSelectedSuggestion(selectedIndex - 1);
            event.preventDefault();
        } else if (event.keyCode == '40') { // down
            changeSelectedSuggestion(selectedIndex + 1);
            event.preventDefault();
        } else if (event.keyCode == '13') { // enter
            useSuggestion(selectedSuggestion, forQueryPart);
            event.preventDefault();
        } else if (event.keyCode == '9') { // tab
            useSuggestion(selectedSuggestion, forQueryPart);
            event.preventDefault();
        } else if (event.keyCode == '27') { // esc
            hideSuggestions();
        }
    }

    render() {
        const {
            visible, suggestions, selectedIndex, componentPosition, forQueryPart,
            changeSelectedSuggestion, useSuggestion
        } = this.props;

        if (!visible) {
            return null;
        }
        const ulStyle = {
            'left': componentPosition.left + 'px',
            'top': componentPosition.top + 'px'
        };
        return (
            <ul className="suggestion-list" style={ulStyle}>
                {suggestions.map((suggestion, index) => (
                    <li key={index}
                        className={index == selectedIndex ? 'active' : ''}
                        onMouseOver={() => {changeSelectedSuggestion(index)}}
                        onClick={(e) => {e.stopPropagation();useSuggestion(suggestion, forQueryPart);}}>
                        {suggestion}
                    </li>
                ))}
            </ul>
        );
    }
}
SuggestionList.propTypes = {
    visible: PropTypes.bool.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedIndex: PropTypes.number.isRequired,
    componentPosition: PropTypes.shape({
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired
    }).isRequired,
    forQueryPart: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    changeSelectedSuggestion: PropTypes.func.isRequired,
    hideSuggestions: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    ...getSuggestionList(state)
});

export default connect(
    mapStateToProps,
    {
        changeSelectedSuggestion,
        hideSuggestions,
        useSuggestion
    }
)(SuggestionList);
/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, TextInput, KeyboardAvoidingView} from 'react-native';

import {MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER} from './Constant';
import Color from './Color';

export default class Composer extends React.Component {

    status = 0;
    key = 'input'

    onContentSizeChange(e) {
        const {contentSize} = e.nativeEvent;

        // Support earlier versions of React Native on Android.
        if (!contentSize) return;

        if (
            !this.contentSize ||
            this.contentSize.width !== contentSize.width ||
            this.contentSize.height !== contentSize.height
        ) {
            this.contentSize = contentSize;
            this.props.onInputSizeChanged(this.contentSize);
        }
    }

    onChangeText(text) {
        this.status = 1;
        this.props.onTextChanged(text);
    }

    render() {
        let text = this.props.text;

        if (text === '' && this.status === 1) {
            this.status = 0;
            this.key = 'input' + Math.floor(Math.random() * 10);
        }

        return (

            <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
                <TextInput key={this.key}
                           placeholder={this.props.placeholder}
                           placeholderTextColor={this.props.placeholderTextColor}
                           multiline={this.props.multiline}
                           onChange={(e) => this.onContentSizeChange(e)}
                           onContentSizeChange={(e) => this.onContentSizeChange(e)}
                           onChangeText={(text) => this.onChangeText(text)}
                           style={[styles.textInput, this.props.textInputStyle, {height: this.props.composerHeight}]}
                           autoFocus={this.props.textInputAutoFocus}
                           accessibilityLabel={this.props.text || this.props.placeholder}
                           enablesReturnKeyAutomatically
                           underlineColorAndroid="transparent"
                           keyboardAppearance={this.props.keyboardAppearance}
                           {...this.props.textInputProps}
                           onSubmitEditing={() => {
                           this.props.onSend && this.props.onSend({text: text.trim()}, true);
                           }}
                          returnKeyType={'send'}
                />
            </KeyboardAvoidingView>

        );
    }

}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 16,
        marginTop: Platform.select({
            ios: 6,
            android: 0,
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3,
        }),
    },
});

Composer.defaultProps = {
    composerHeight: MIN_COMPOSER_HEIGHT,
    text: '',
    placeholderTextColor: Color.defaultProps,
    placeholder: DEFAULT_PLACEHOLDER,
    textInputProps: null,
    multiline: true,
    textInputStyle: {},
    textInputAutoFocus: false,
    keyboardAppearance: 'default',
    onTextChanged: () => {
    },
    onInputSizeChanged: () => {
    },
};

Composer.propTypes = {
    composerHeight: PropTypes.number,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    textInputProps: PropTypes.object,
    onTextChanged: PropTypes.func,
    onInputSizeChanged: PropTypes.func,
    multiline: PropTypes.bool,
    textInputStyle: TextInput.propTypes.style,
    textInputAutoFocus: PropTypes.bool,
    keyboardAppearance: PropTypes.string,
};

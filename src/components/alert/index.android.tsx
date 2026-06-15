import React, { useEffect } from "react";
import { Alert as RNAlert } from "react-native";
import { AlertProps } from "./types";

const AlertAndroid: React.FC<AlertProps> = ({ title, message, visible, onClose, actions }) => {
    useEffect(() => {
        if(visible) {
            RNAlert.alert(
                title,
                message,
                actions?.length
                    ? actions.map((action) => ({
                        text: action.label,
                        onPress: action.onPress,
                        style: action.variant === 'danger' ? 'destructive' : action.variant === 'secondary' ? 'cancel' : 'default',
                    }))
                    : [{ text: 'OK', onPress: onClose }]
            );
        }
    }, [visible, title, message, onClose, actions]);

    return null;
};

export default AlertAndroid;

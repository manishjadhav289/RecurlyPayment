import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    Alert,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type PaymentScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Payment'>;
    route: RouteProp<RootStackParamList, 'Payment'>;
};

// TODO: Replace with your actual backend URL
const BACKEND_URL = 'http://10.0.2.2:3001'; // Android emulator localhost

export default function PaymentScreen({
    navigation,
    route,
}: PaymentScreenProps): React.JSX.Element {
    const { amount, planCode, planName } = route.params;
    const [loading, setLoading] = useState(true);
    const webViewRef = useRef<WebView>(null);

    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'PAYMENT_SUCCESS') {
                navigation.replace('Success', { subscriptionId: data.subscriptionId });
            } else if (data.type === 'PAYMENT_ERROR') {
                Alert.alert('Payment Failed', data.message || 'Something went wrong');
            } else if (data.type === 'PAYMENT_CANCELLED') {
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error parsing WebView message:', error);
        }
    };

    const paymentUrl = `${BACKEND_URL}/payment.html?amount=${amount}&planCode=${planCode}&planName=${encodeURIComponent(planName)}`;

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text style={styles.loadingText}>Loading payment form...</Text>
                </View>
            )}
            <WebView
                ref={webViewRef}
                source={{ uri: paymentUrl }}
                style={styles.webview}
                onMessage={handleMessage}
                onLoadEnd={() => setLoading(false)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        zIndex: 999,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },
    webview: {
        flex: 1,
    },
});

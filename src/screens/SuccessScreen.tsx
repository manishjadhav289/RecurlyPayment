import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type SuccessScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Success'>;
    route: RouteProp<RootStackParamList, 'Success'>;
};

export default function SuccessScreen({
    navigation,
    route,
}: SuccessScreenProps): React.JSX.Element {
    const { subscriptionId } = route.params;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [scaleAnim, fadeAnim]);

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Cart' }],
        });
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.successIcon,
                    { transform: [{ scale: scaleAnim }] },
                ]}>
                <Text style={styles.checkmark}>✓</Text>
            </Animated.View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.subtitle}>
                    Thank you for your subscription
                </Text>

                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Subscription Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Subscription ID</Text>
                        <Text style={styles.detailValue}>{subscriptionId}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Active</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={handleGoHome}
                    activeOpacity={0.8}>
                    <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        elevation: 8,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    checkmark: {
        fontSize: 60,
        color: '#fff',
        fontWeight: 'bold',
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 32,
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        marginBottom: 32,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    detailValue: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '500',
    },
    statusBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#16a34a',
        fontSize: 12,
        fontWeight: 'bold',
    },
    homeButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

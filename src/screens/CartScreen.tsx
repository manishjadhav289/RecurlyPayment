import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

type Plan = {
    id: string;
    code: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
};

const PLANS: Plan[] = [
    {
        id: '1',
        code: 'basic_monthly',
        name: 'Basic',
        price: 499,
        description: 'Perfect for individuals',
        features: ['5 Projects', '10 GB Storage', 'Email Support'],
    },
    {
        id: '2',
        code: 'premium_monthly',
        name: 'Premium',
        price: 999,
        description: 'Best for professionals',
        features: ['Unlimited Projects', '100 GB Storage', 'Priority Support', 'Analytics'],
        popular: true,
    },
    {
        id: '3',
        code: 'enterprise_monthly',
        name: 'Enterprise',
        price: 2499,
        description: 'For large teams',
        features: ['Unlimited Everything', '1 TB Storage', '24/7 Support', 'Custom Integrations'],
    },
];

export default function CartScreen({ navigation }: Props): React.JSX.Element {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(PLANS[1]);

    const handlePayNow = () => {
        if (selectedPlan) {
            navigation.navigate('Payment', {
                amount: selectedPlan.price,
                planCode: selectedPlan.code,
                planName: selectedPlan.name,
            });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Choose Your Plan</Text>
                <Text style={styles.subtitle}>Select a subscription plan that fits your needs</Text>

                {PLANS.map(plan => (
                    <TouchableOpacity
                        key={plan.id}
                        style={[
                            styles.planCard,
                            selectedPlan?.id === plan.id && styles.selectedCard,
                            plan.popular && styles.popularCard,
                        ]}
                        onPress={() => setSelectedPlan(plan)}
                        activeOpacity={0.8}>
                        {plan.popular && (
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularText}>MOST POPULAR</Text>
                            </View>
                        )}
                        <View style={styles.planHeader}>
                            <Text style={styles.planName}>{plan.name}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.currency}>₹</Text>
                                <Text style={styles.price}>{plan.price}</Text>
                                <Text style={styles.period}>/mo</Text>
                            </View>
                        </View>
                        <Text style={styles.planDescription}>{plan.description}</Text>
                        <View style={styles.featuresContainer}>
                            {plan.features.map((feature, index) => (
                                <View key={index} style={styles.featureRow}>
                                    <Text style={styles.checkmark}>✓</Text>
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>
                        {selectedPlan?.id === plan.id && (
                            <View style={styles.selectedIndicator}>
                                <Text style={styles.selectedText}>✓ Selected</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>₹{selectedPlan?.price || 0}/month</Text>
                </View>
                <TouchableOpacity
                    style={[styles.payButton, !selectedPlan && styles.payButtonDisabled]}
                    onPress={handlePayNow}
                    disabled={!selectedPlan}
                    activeOpacity={0.8}>
                    <Text style={styles.payButtonText}>💳 Pay Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginTop: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 4,
    },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectedCard: {
        borderColor: '#6366f1',
        backgroundColor: '#f5f3ff',
    },
    popularCard: {
        borderColor: '#6366f1',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        left: 20,
        backgroundColor: '#6366f1',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    currency: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    period: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
    },
    planDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 16,
    },
    featuresContainer: {
        marginTop: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkmark: {
        color: '#10b981',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#475569',
    },
    selectedIndicator: {
        marginTop: 12,
        alignItems: 'center',
    },
    selectedText: {
        color: '#6366f1',
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 16,
        color: '#64748b',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    payButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    payButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

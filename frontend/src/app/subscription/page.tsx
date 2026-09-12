'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  Shield, 
  Terminal, 
  Server,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'community',
      name: 'Community',
      badge: null,
      price: '$0',
      period: 'Free forever',
      description: 'Developers & students testing the platform.',
      popular: false,
      features: [
        'Up to 100 EPS telemetry stream',
        'Basic Anomaly Detection (Isolation Forest)',
        'Live Dashboard (No Data Retention)',
        'Community Discord Support',
        'Public MITRE ATT&CK reference feed',
      ],
      ctaText: 'Start Building',
      ctaStyle: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200',
      icon: Terminal,
      iconColor: 'text-[#9EABA2]',
    },
    {
      id: 'starter',
      name: 'Starter',
      badge: null,
      price: billingCycle === 'annual' ? '$159' : '$199',
      period: billingCycle === 'annual' ? 'per month, billed annually' : 'per month, billed monthly',
      description: 'Small SOC teams and growing security operations.',
      popular: false,
      features: [
        'Up to 2,500 EPS telemetry stream',
        'Hybrid AI (Isolation Forest + XGBoost)',
        '7-Day Telemetry Log Retention',
        'Standard MITRE ATT&CK kill-chain mapping',
        'Email & Ticket Support (24h SLA)',
        'Automated alert triage exports',
      ],
      ctaText: 'Get Started',
      ctaStyle: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200',
      icon: Activity,
      iconColor: 'text-[#E8B298]',
    },
    {
      id: 'professional',
      name: 'Professional',
      badge: 'MOST POPULAR',
      price: billingCycle === 'annual' ? '$559' : '$699',
      period: billingCycle === 'annual' ? 'per month, billed annually' : 'per month, billed monthly',
      description: 'Enterprise SOC teams requiring automated XAI triage.',
      popular: true,
      features: [
        'Up to 25,000 EPS high-speed ingestion',
        'Full AI Stack (XGBoost + IsoForest + SHAP)',
        '30-Day High-Resolution Telemetry Retention',
        'Real-Time SHAP Feature Attribution',
        'Automated BGP Flowspec Mitigation Rules',
        'Priority 24/7 SOC Engineering SLA (1h response)',
        'SIEM & Elasticsearch Cluster Sync',
      ],
      ctaText: 'Upgrade to Pro',
      ctaStyle: 'bg-[#EECC8C] text-black hover:opacity-90 shadow-md font-bold',
      icon: Sparkles,
      iconColor: 'text-[#EECC8C]',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      badge: 'CUSTOM VOLUME',
      price: 'Custom',
      period: 'tailored SLA & volume',
      description: 'Large-scale infrastructure & multi-cloud networks.',
      popular: false,
      features: [
        'Unlimited EPS & Multi-VPC Pipelines',
        'Dedicated On-Prem / Private Cloud AI Daemon',
        '365-Day Compliance Log Vault (SOC2 / HIPAA)',
        'Custom SIEM/SOAR Ingestion Adapters',
        'Dedicated Threat Hunting Architect',
        '99.999% Ingestion Uptime SLA Guarantee',
        'Custom ML Model Fine-Tuning on Raw PCAPs',
      ],
      ctaText: 'Contact Security Team',
      ctaStyle: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200',
      icon: Shield,
      iconColor: 'text-[#5F6F65] dark:text-[#BDD1C5]',
    },
  ];

  return (
    <div className="space-y-8 pb-12 min-w-0">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EECC8C]/15 border border-[#EECC8C]/30 text-yellow-800 dark:text-[#EECC8C] text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Flexible Cyber Defense Licensing</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Scale Real-Time AI Threat Detection
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2.5 leading-relaxed">
          Select the capacity tier matching your packet throughput. Upgrade, downgrade, or deploy on-premises at any time.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/10 mt-6 shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              billingCycle === 'annual'
                ? 'bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-[#9EABA2]/20 text-[#5F6F65] dark:text-[#BDD1C5] px-1.5 py-0.2 rounded font-mono font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* 4-Column Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto mt-8">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <div
              key={plan.id}
              className={`h-full flex flex-col justify-between rounded-2xl bg-white dark:bg-[#1A1F2B] p-6 transition-all duration-300 relative shadow-sm hover:shadow-xl ${
                plan.popular
                  ? 'border-2 border-[#EECC8C] ring-2 ring-[#EECC8C]/20 dark:shadow-[0_0_25px_rgba(238,204,140,0.15)]'
                  : 'border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {/* Most Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#EECC8C] text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/5">
                      <IconComponent className={`w-4 h-4 ${plan.iconColor}`} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-gray-900 dark:text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price !== '$0' && plan.price !== 'Custom' && (
                      <span className="text-xs text-gray-400 font-mono">/mo</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    {plan.period}
                  </p>
                </div>

                {/* Feature Specs List */}
                <div className="mt-6 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Included Capabilities
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#5F6F65] dark:text-[#BDD1C5] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA Button Container (Pinned to bottom using mt-auto) */}
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${plan.ctaStyle}`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Security FAQ Note */}
      <div className="max-w-[1400px] mx-auto p-5 rounded-2xl bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 mt-6 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#EECC8C]/15 text-[#EECC8C] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Need Air-Gapped or Government Cloud Deployments?
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Shield-AI supports Docker Compose, Kubernetes Helm Charts, and AWS GovCloud air-gapped instances.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#0B0F19] hover:bg-gray-200 dark:hover:bg-[#252C3D] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-800 dark:text-gray-200 transition shrink-0"
        >
          Request GovCloud Spec Sheet
        </button>
      </div>
    </div>
  );
}

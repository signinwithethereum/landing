import { Wallet, getWalletConnectConnector } from '@rainbow-me/rainbowkit'

export interface GeminiWalletOptions {
	projectId: string
}

export const geminiWallet = ({ projectId }: GeminiWalletOptions): Wallet => ({
	id: 'gemini',
	name: 'Gemini Wallet',
	iconUrl: '/assets/icons/wallets/gemini.webp',
	iconBackground: '#fff',
	downloadUrls: {
		ios: 'https://apps.apple.com/us/app/gemini-buy-bitcoin-crypto/id1408914447',
		android:
			'https://play.google.com/store/apps/details?id=com.gemini.android.app',
		qrCode: 'https://gemini.onelink.me/OZOu/kycgfjew',
	},
	mobile: {
		getUri: (uri: string) => uri,
	},
	qrCode: {
		getUri: (uri: string) => uri,
		instructions: {
			learnMoreUrl: 'https://support.gemini.com/hc/en-us',
			steps: [
				{
					description:
						'After you scan, a connection prompt will appear for you to connect your wallet.',
					step: 'scan',
					title: 'Open the Gemini app',
				},
			],
		},
	},
	extension: {
		instructions: {
			learnMoreUrl: 'https://support.gemini.com/hc/en-us',
			steps: [
				{
					description:
						'We recommend pinning Gemini Wallet to your taskbar for easier access to your wallet.',
					step: 'install',
					title: 'Install the Gemini Wallet extension',
				},
				{
					description:
						'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
					step: 'create',
					title: 'Create or Import a Wallet',
				},
				{
					description:
						'Once you set up your wallet, click below to refresh the browser and load up the extension.',
					step: 'refresh',
					title: 'Refresh your browser',
				},
			],
		},
	},
	createConnector: getWalletConnectConnector({ projectId }),
})

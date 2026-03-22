import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme';

interface Props {
  videoUrl: string;
  /** Se true, inicia o player diretamente sem mostrar thumbnail */
  autoPlay?: boolean;
}

/** Extrai o ID de uma URL do YouTube */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/**
 * Gera um HTML local com o iframe do YouTube.
 * Usar source={{ html }} em vez de source={{ uri }} evita o erro 153
 * ("Video player configuration error"), que ocorre quando o YouTube bloqueia
 * embeds sem Referer — ao injetar HTML local a restrição não se aplica.
 */
function buildEmbedHtml(videoId: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe
    src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1"
    allow="autoplay; fullscreen; accelerometer; gyroscope; encrypted-media; picture-in-picture"
    allowfullscreen
  ></iframe>
</body>
</html>`;
}

export const VideoThumb: React.FC<Props> = ({ videoUrl, autoPlay = false }) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [webviewLoading, setWebviewLoading] = useState(true);

  const videoId = extractYouTubeId(videoUrl);

  // URL não é YouTube — abre no browser
  if (!videoId) {
    const handleOpen = async () => {
      try {
        const can = await Linking.canOpenURL(videoUrl);
        if (can) await Linking.openURL(videoUrl);
        else Alert.alert('Erro', 'Não foi possível abrir o vídeo.');
      } catch {
        Alert.alert('Erro', 'Não foi possível abrir o vídeo.');
      }
    };
    return (
      <TouchableOpacity style={styles.fallbackBtn} onPress={handleOpen} activeOpacity={0.8}>
        <Ionicons name="play-circle" size={18} color={colors.primary} />
        <Text style={styles.fallbackText}>Ver execução</Text>
      </TouchableOpacity>
    );
  }

  const thumbUri = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <View style={styles.wrapper}>
      {!playing ? (
        /* ── Thumbnail ── */
        <TouchableOpacity style={styles.thumbContainer} onPress={() => setPlaying(true)} activeOpacity={0.88}>
          <Image source={{ uri: thumbUri }} style={styles.thumb} resizeMode="cover" />
          <View style={styles.overlay} />
          <View style={styles.playBtn}>
            <Ionicons name="play" size={26} color={colors.white} />
          </View>
          <View style={styles.badge}>
            <Ionicons name="logo-youtube" size={13} color="#FF0000" />
            <Text style={styles.badgeText}>Ver execução</Text>
          </View>
        </TouchableOpacity>
      ) : (
        /* ── Player ── */
        <View style={styles.playerContainer}>
          {webviewLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
          <WebView
            source={{ html: buildEmbedHtml(videoId) }}
            style={styles.webview}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            onLoadEnd={() => setWebviewLoading(false)}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            originWhitelist={['*']}
          />
        </View>
      )}
    </View>
  );
};

const PLAYER_HEIGHT = 210;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.sm,
  },

  /* Thumbnail */
  thumbContainer: {
    height: PLAYER_HEIGHT,
    backgroundColor: colors.border,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  badge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },

  /* Player */
  playerContainer: {
    height: PLAYER_HEIGHT,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  /* Fallback */
  fallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  fallbackText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});

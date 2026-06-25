import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    type LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type TabConfig = {
  label: string;
  activeIcon: IconName;
  inactiveIcon: IconName;
};

const ACTIVE_BUBBLE_SIZE = 52;
const TAB_ICON_SIZE = 20;
const ACTIVE_TAB_ANIMATION_DURATION = 220;

const TAB_CONFIG: Record<string, TabConfig> = {
  home: {
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  learn: {
    label: "Learn",
    activeIcon: "book",
    inactiveIcon: "book-outline",
  },
  "ai-teacher": {
    label: "AI Teacher",
    activeIcon: "sparkles",
    inactiveIcon: "sparkles-outline",
  },
  chat: {
    label: "Chat",
    activeIcon: "chatbubble",
    inactiveIcon: "chatbubble-outline",
  },
  profile: {
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
};

function getTabConfig(routeName: string): TabConfig {
  return (
    TAB_CONFIG[routeName] ?? {
      label: routeName,
      activeIcon: "ellipse",
      inactiveIcon: "ellipse-outline",
    }
  );
}

export default function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  const tabWidth = tabBarWidth > 0 ? tabBarWidth / state.routes.length : 0;

  useEffect(() => {
    if (!tabWidth) {
      return;
    }

    const targetPosition =
      state.index * tabWidth + (tabWidth - ACTIVE_BUBBLE_SIZE) / 2;

    indicatorX.stopAnimation();

    Animated.timing(indicatorX, {
      toValue: targetPosition,
      duration: ACTIVE_TAB_ANIMATION_DURATION,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [indicatorX, state.index, tabWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setTabBarWidth(event.nativeEvent.layout.width);
  };

  const activeConfig = getTabConfig(state.routes[state.index]?.name ?? "home");

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar} onLayout={handleLayout}>
        {tabWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeBubble,
              {
                transform: [{ translateX: indicatorX }],
              },
            ]}
          >
            <Ionicons
              name={activeConfig.activeIcon}
              size={TAB_ICON_SIZE}
              color="#FFFFFF"
            />
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = getTabConfig(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              {isFocused ? (
                <View style={styles.focusedSpacer} />
              ) : (
                <View style={styles.inactiveTabContent}>
                  <Ionicons
                    name={config.inactiveIcon}
                    size={TAB_ICON_SIZE}
                    color={colors.neutral.textSecondary}
                  />
                  <Text numberOfLines={1} style={styles.inactiveLabel}>
                    {config.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  tabBar: {
    position: "relative",
    flexDirection: "row",
    height: 80,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F1F5",
    shadowColor: "#0D132B",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    paddingHorizontal: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBubble: {
    position: "absolute",
    top: 10,
    width: ACTIVE_BUBBLE_SIZE,
    height: ACTIVE_BUBBLE_SIZE,
    borderRadius: ACTIVE_BUBBLE_SIZE / 2,
    backgroundColor: colors.primary.purple,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.purple,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  inactiveTabContent: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  inactiveLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: colors.neutral.textSecondary,
  },
  focusedSpacer: {
    width: ACTIVE_BUBBLE_SIZE,
    height: ACTIVE_BUBBLE_SIZE,
  },
});

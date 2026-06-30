import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type TabConfig = {
  label: string;
  activeIcon: IconName;
  inactiveIcon: IconName;
};

const TAB_ICON_SIZE = 20;

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
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
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
              <Ionicons
                name={isFocused ? config.activeIcon : config.inactiveIcon}
                size={TAB_ICON_SIZE}
                color={
                  isFocused
                    ? colors.primary.purple
                    : colors.neutral.textSecondary
                }
              />
              <Text
                numberOfLines={1}
                style={[styles.label, isFocused ? styles.activeLabel : null]}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#ECEEF4",
  },
  tabBar: {
    flexDirection: "row",
    height: 76,
    backgroundColor: "#FFFFFF",
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: colors.neutral.textSecondary,
  },
  activeLabel: {
    color: colors.primary.purple,
  },
});

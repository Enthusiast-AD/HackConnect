import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/useTheme";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Webhook,
  Save,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    teamUpdates: true,
    hackathonReminders: true,
    weeklyDigest: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />

      <main className="pl-64 pt-16">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="developer" className="gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Developer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <Card className="border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" className="transition-all duration-200 focus:scale-[1.01]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="transition-all duration-200 focus:scale-[1.01]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="transition-all duration-200 focus:scale-[1.01]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself..." className="transition-all duration-200 focus:scale-[1.01]" />
                  </div>
                  <Button className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 animate-fade-in">
              <Card className="border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what you want to be notified about</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                    { key: "push", label: "Push Notifications", desc: "Browser push notifications" },
                    { key: "teamUpdates", label: "Team Updates", desc: "Notifications about your team activity" },
                    { key: "hackathonReminders", label: "Hackathon Reminders", desc: "Deadline and event reminders" },
                    { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of platform activity" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-muted/50">
                      <div className="space-y-0.5">
                        <Label className="text-base">{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                        }
                        className="data-[state=checked]:bg-primary transition-all duration-200"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 animate-fade-in">
              <Card className="border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how HackHub looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base mb-4 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "light", icon: Sun, label: "Light" },
                        { value: "dark", icon: Moon, label: "Dark" },
                        { value: "system", icon: Monitor, label: "System" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => option.value !== "system" && setTheme(option.value as "light" | "dark")}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300",
                            "hover:scale-105 active:scale-95",
                            theme === option.value
                              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <option.icon className={cn(
                            "h-6 w-6 transition-colors",
                            theme === option.value ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className={cn(
                            "text-sm font-medium",
                            theme === option.value ? "text-primary" : "text-muted-foreground"
                          )}>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-muted/50">
                    <div className="space-y-0.5">
                      <Label className="text-base">Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 animate-fade-in">
              <Card className="border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="transition-all duration-200 focus:scale-[1.01]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="transition-all duration-200 focus:scale-[1.01]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="transition-all duration-200 focus:scale-[1.01]" />
                  </div>
                  <Button className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95">
                    <Shield className="h-4 w-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="developer" className="space-y-6 animate-fade-in">
              <Card className="border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API access tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm break-all border border-border/50">
                    hk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="transition-all duration-200 hover:scale-105 active:scale-95">
                      Regenerate Key
                    </Button>
                    <Button variant="outline" className="transition-all duration-200 hover:scale-105 active:scale-95">
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>Configure webhook endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input id="webhookUrl" placeholder="https://your-app.com/webhook" className="transition-all duration-200 focus:scale-[1.01]" />
                  </div>
                  <Button className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95">
                    <Save className="h-4 w-4" />
                    Save Webhook
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

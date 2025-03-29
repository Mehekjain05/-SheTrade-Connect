import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";

const SettingsPage = () => {
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setProfileUpdating(false);
      // In a real app, this would update the user profile via API
      console.log("Profile updated");
    }, 1000);
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setPasswordUpdating(false);
      // In a real app, this would update the password via API
      console.log("Password changed");
    }, 1000);
  };
  
  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentUpdating(false);
      // In a real app, this would update payment methods via API
      console.log("Payment methods updated");
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Settings | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
          Account Settings
        </h1>
        <p className="text-neutral-medium">
          Manage your account, profile, and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and business details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Sophia Patel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="sophia_patel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="sophia@ecotextiles.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+91 9876543210" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input id="business-name" defaultValue="Eco Textiles Ltd" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="business-description">Business Description</Label>
                      <Textarea 
                        id="business-description" 
                        className="min-h-[100px]"
                        defaultValue="Sustainable fabrics from recycled materials, specializing in eco-friendly textiles for fashion and home decor."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="Mumbai, Maharashtra" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://ecotextiles.com" />
                    </div>
                  </div>
                  <Button type="submit" disabled={profileUpdating}>
                    {profileUpdating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src="" alt="Sophia Patel" />
                    <AvatarFallback className="bg-primary-light text-white text-xl">SP</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Change</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Business Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-lg bg-primary-light flex items-center justify-center text-white text-2xl mb-4">
                    ET
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Change</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Free Plan</p>
                      <p className="text-sm text-neutral-medium">Basic access to SheTrade Connect</p>
                    </div>
                    <Button variant="outline" size="sm">Upgrade</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to maintain account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button type="submit" disabled={passwordUpdating}>
                    {passwordUpdating ? "Updating..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-sm text-neutral-medium">Not enabled</p>
                    </div>
                    <Switch />
                  </div>
                  <p className="text-sm text-neutral-medium mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline" size="sm">Set up 2FA</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-neutral-lightest rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">Current Session</p>
                        <Badge className="bg-success text-white">Active</Badge>
                      </div>
                      <p className="text-xs text-neutral-medium">
                        <i className="ri-computer-line mr-1"></i>
                        Windows 10 • Chrome • Mumbai
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign Out All Other Devices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New order notifications</p>
                        <p className="text-sm text-neutral-medium">Receive emails when you get new orders</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Procurement opportunities</p>
                        <p className="text-sm text-neutral-medium">Get notified about relevant procurement opportunities</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">AI supplier matches</p>
                        <p className="text-sm text-neutral-medium">Notifications when AI finds potential supplier matches</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Community forum mentions</p>
                        <p className="text-sm text-neutral-medium">Notify when someone mentions you in the forum</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing emails</p>
                        <p className="text-sm text-neutral-medium">Updates, newsletters, and promotions</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">In-App Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order updates</p>
                        <p className="text-sm text-neutral-medium">Notifications about order status changes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Messages</p>
                        <p className="text-sm text-neutral-medium">Notifications when you receive new messages</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Connection requests</p>
                        <p className="text-sm text-neutral-medium">Notifications for new connection requests</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods for premium services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePayment}>
                  <div className="space-y-4 mb-6">
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="ri-bank-card-line text-xl mr-3 text-neutral-medium"></i>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-neutral-medium">Expires: 12/24</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-error hover:text-error">Remove</Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" type="button" className="flex items-center">
                      <i className="ri-add-line mr-2"></i>
                      Add Payment Method
                    </Button>
                  </div>
                  <Button type="submit" disabled={paymentUpdating}>
                    {paymentUpdating ? "Updating..." : "Update Payment Methods"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-medium">Free Plan</h3>
                    <p className="text-sm text-neutral-medium">Basic access to SheTrade Connect features</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="text-sm flex items-center">
                      <i className="ri-check-line text-success mr-2"></i>
                      Basic AI recommendations
                    </li>
                    <li className="text-sm flex items-center">
                      <i className="ri-check-line text-success mr-2"></i>
                      Digital storefront
                    </li>
                    <li className="text-sm flex items-center">
                      <i className="ri-check-line text-success mr-2"></i>
                      Community forum access
                    </li>
                    <li className="text-sm flex items-center text-neutral-medium">
                      <i className="ri-close-line mr-2"></i>
                      Premium learning resources
                    </li>
                    <li className="text-sm flex items-center text-neutral-medium">
                      <i className="ri-close-line mr-2"></i>
                      Advanced marketing tools
                    </li>
                  </ul>
                  <Button className="w-full">Upgrade to Premium</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <p className="text-neutral-medium">No billing history available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your SheTrade Connect experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Display</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                          <SelectItem value="gu">Gujarati</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="inr">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="usd">US Dollar ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                          <SelectItem value="gbp">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-neutral-medium">Switch between light and dark modes</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-neutral-medium">Make your profile visible to other businesses</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show my products publicly</p>
                        <p className="text-sm text-neutral-medium">Allow others to see your product catalog</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data analytics</p>
                        <p className="text-sm text-neutral-medium">Allow us to collect anonymous usage data to improve our services</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

// Badge component for security tab
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default SettingsPage;

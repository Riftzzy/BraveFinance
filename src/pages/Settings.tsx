import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="App configuration and preferences"
      />

      <div className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Bareera Intl"
                defaultValue="Bareera Intl"
                className="touch-target"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
              <Input id="fiscalYear" type="date" className="touch-target" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Base Currency</Label>
              <Input
                id="currency"
                placeholder="USD"
                defaultValue="USD"
                className="touch-target"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates for important events
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications on mobile
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Approval Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when approvals are pending
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Auto logout after 30 minutes of inactivity
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">HR Module</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <Button variant="outline" size="sm" className="touch-target">
                Configure
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Trading Module</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <Button variant="outline" size="sm" className="touch-target">
                Configure
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">CRM Module</p>
                <p className="text-sm text-muted-foreground">Not Connected</p>
              </div>
              <Button variant="outline" size="sm" className="touch-target">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full touch-target">Save Settings</Button>
      </div>
    </PageContainer>
  );
}

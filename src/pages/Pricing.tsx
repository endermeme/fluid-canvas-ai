
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Pricing: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Pricing Plans</h1>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Choose the plan that fits your needs
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>For individual users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">$0</div>
              <ul className="space-y-2">
                <li>5 quizzes</li>
                <li>Basic features</li>
                <li>Community support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For professional users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">$9.99</div>
              <ul className="space-y-2">
                <li>Unlimited quizzes</li>
                <li>Advanced features</li>
                <li>Priority support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">Contact us</div>
              <ul className="space-y-2">
                <li>Custom solutions</li>
                <li>Dedicated support</li>
                <li>Team management</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

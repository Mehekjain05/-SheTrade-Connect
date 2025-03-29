import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Separator } from "@/components/ui/separator";
import LoadingState from "@/components/shared/LoadingState";
import { FinancialOffer } from "@/types";
import { Helmet } from "react-helmet";

// Format currency utility function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount / 100);
};

// Format interest rate utility function
const formatInterestRate = (basisPoints: number) => {
  return (basisPoints / 100).toFixed(2) + '%';
};

const FinancialOfferCard = ({ offer }: { offer: FinancialOffer }) => {
  const offerTypeMap: Record<string, { title: string, icon: string }> = {
    'loan': { 
      title: 'Working Capital Loan', 
      icon: 'ri-money-rupee-circle-line' 
    },
    'invoice_financing': { 
      title: 'Invoice Financing', 
      icon: 'ri-file-list-3-line' 
    },
    'equipment_loan': { 
      title: 'Equipment Loan', 
      icon: 'ri-tools-line' 
    }
  };
  
  const { title, icon } = offerTypeMap[offer.type] || { 
    title: offer.type.replace('_', ' ').charAt(0).toUpperCase() + offer.type.replace('_', ' ').slice(1), 
    icon: 'ri-bank-line' 
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <BadgeIcon
            icon={icon}
            color="accent"
            className="mt-1"
          />
          <div className="w-full">
            <h3 className="font-medium text-lg mb-1">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <p className="text-sm text-neutral-medium">Amount</p>
                <p className="text-lg font-semibold text-neutral-dark">{formatCurrency(offer.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-medium">Interest Rate</p>
                <p className="text-lg font-semibold text-neutral-dark">{formatInterestRate(offer.interestRate)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-medium">Term</p>
                <p className="text-lg font-semibold text-neutral-dark">{offer.termMonths} months</p>
              </div>
              <div>
                <p className="text-sm text-neutral-medium">Monthly Payment</p>
                <p className="text-lg font-semibold text-neutral-dark">
                  {formatCurrency(Math.round(offer.amount * (1 + (offer.interestRate / 10000)) / offer.termMonths))}
                </p>
              </div>
            </div>
            <Button className="w-full bg-accent hover:bg-accent-dark text-white">
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FinancePage = () => {
  const { data: financialOffers, isLoading } = useQuery({
    queryKey: ['/api/financial-offers'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/financial-offers', undefined);
      return res.json() as Promise<FinancialOffer[]>;
    }
  });

  return (
    <>
      <Helmet>
        <title>Financial Tools | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
          Financial Inclusion Suite
        </h1>
        <p className="text-neutral-medium">
          Access financial tools, credit scoring, and financing options designed for women entrepreneurs
        </p>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financing">Financing Options</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Management</TabsTrigger>
          <TabsTrigger value="calculators">Financial Calculators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Credit Score Analysis</h3>
                    <BadgeIcon icon="ri-line-chart-line" color="primary" />
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex-1 h-3 bg-neutral-light rounded-full overflow-hidden">
                      <Progress value={78} className="h-3" />
                    </div>
                    <span className="ml-3 font-medium">78/100</span>
                  </div>
                  <p className="text-sm text-neutral-medium mb-3">Your business credit score is in good standing</p>
                  <Button variant="link" className="p-0 h-auto text-primary justify-start">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Outstanding Invoices</h3>
                    <BadgeIcon icon="ri-bill-line" color="accent" />
                  </div>
                  <div className="space-y-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fashion Retail Inc.</span>
                      <span className="text-sm font-medium">₹45,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">EcoHome Products</span>
                      <span className="text-sm font-medium">₹32,000</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-medium mb-1">Total outstanding: ₹77,000</p>
                  <Button variant="link" className="p-0 h-auto text-primary justify-start">
                    Manage Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Payment History</h3>
                    <BadgeIcon icon="ri-history-line" color="secondary" />
                  </div>
                  <div className="space-y-3 mb-3">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">May 2023</span>
                        <span className="text-sm text-success">On Time</span>
                      </div>
                      <Separator className="my-1" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">April 2023</span>
                        <span className="text-sm text-success">On Time</span>
                      </div>
                      <Separator className="my-1" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">March 2023</span>
                        <span className="text-sm text-warning">Late</span>
                      </div>
                      <Separator className="my-1" />
                    </div>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-primary justify-start">
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Revenue Trend</h4>
                  <div className="h-40 bg-neutral-lightest rounded-md flex items-center justify-center">
                    <p className="text-neutral-medium">Revenue chart visualization will be displayed here</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Cash Flow</h4>
                  <div className="h-40 bg-neutral-lightest rounded-md flex items-center justify-center">
                    <p className="text-neutral-medium">Cash flow chart visualization will be displayed here</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Expense Breakdown</h4>
                  <div className="h-40 bg-neutral-lightest rounded-md flex items-center justify-center">
                    <p className="text-neutral-medium">Expense chart visualization will be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financing">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Available Financing Options</h2>
            {isLoading ? (
              <LoadingState type="card" count={3} />
            ) : financialOffers && financialOffers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {financialOffers.map((offer) => (
                  <FinancialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-neutral-medium">No financing options available at this time.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Business Documentation</h4>
                  <p className="text-sm text-neutral-medium">Business registration, tax returns for the last 2 years, bank statements for the last 6 months</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Financial Statements</h4>
                  <p className="text-sm text-neutral-medium">Profit & loss statements, balance sheets, cash flow projections</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Collateral Information</h4>
                  <p className="text-sm text-neutral-medium">Details of business assets, inventory, or property that can be used as collateral</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Business Plan</h4>
                  <p className="text-sm text-neutral-medium">Detailed business plan showing how the funds will be used and repayment strategy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-neutral-medium">Track, manage, and finance your outstanding invoices</p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-lightest">
                      <th className="py-2 px-4 text-left font-medium">Invoice #</th>
                      <th className="py-2 px-4 text-left font-medium">Client</th>
                      <th className="py-2 px-4 text-left font-medium">Amount</th>
                      <th className="py-2 px-4 text-left font-medium">Issue Date</th>
                      <th className="py-2 px-4 text-left font-medium">Due Date</th>
                      <th className="py-2 px-4 text-left font-medium">Status</th>
                      <th className="py-2 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-light">
                      <td className="py-3 px-4">INV-2023-001</td>
                      <td className="py-3 px-4">Fashion Retail Inc.</td>
                      <td className="py-3 px-4">₹45,000</td>
                      <td className="py-3 px-4">10 May 2023</td>
                      <td className="py-3 px-4">10 Jun 2023</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-warning bg-opacity-10 text-warning text-xs rounded-full">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">Finance</Button>
                      </td>
                    </tr>
                    <tr className="border-b border-neutral-light">
                      <td className="py-3 px-4">INV-2023-002</td>
                      <td className="py-3 px-4">EcoHome Products</td>
                      <td className="py-3 px-4">₹32,000</td>
                      <td className="py-3 px-4">15 May 2023</td>
                      <td className="py-3 px-4">15 Jun 2023</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-warning bg-opacity-10 text-warning text-xs rounded-full">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">Finance</Button>
                      </td>
                    </tr>
                    <tr className="border-b border-neutral-light">
                      <td className="py-3 px-4">INV-2023-003</td>
                      <td className="py-3 px-4">Global Textiles</td>
                      <td className="py-3 px-4">₹28,500</td>
                      <td className="py-3 px-4">20 April 2023</td>
                      <td className="py-3 px-4">20 May 2023</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-success bg-opacity-10 text-success text-xs rounded-full">
                          Paid
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" disabled>Finance</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <Button>
                  <i className="ri-add-line mr-2"></i>
                  Create New Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculators">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Loan Amount</label>
                    <Input
                      type="number"
                      placeholder="Enter amount in INR"
                      className="w-full"
                      defaultValue="500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                    <Input
                      type="number"
                      placeholder="Enter interest rate"
                      className="w-full"
                      defaultValue="8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Loan Term (Months)</label>
                    <Input
                      type="number"
                      placeholder="Enter loan term"
                      className="w-full"
                      defaultValue="24"
                    />
                  </div>
                  <Button className="w-full">Calculate EMI</Button>
                  
                  <div className="mt-4 p-4 bg-neutral-lightest rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-medium">Monthly Payment (EMI):</span>
                      <span className="font-medium">₹22,752</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-medium">Total Interest:</span>
                      <span className="font-medium">₹46,048</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-medium">Total Amount:</span>
                      <span className="font-medium">₹546,048</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Working Capital Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Revenue</label>
                    <Input
                      type="number"
                      placeholder="Enter monthly revenue"
                      className="w-full"
                      defaultValue="200000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Expenses</label>
                    <Input
                      type="number"
                      placeholder="Enter monthly expenses"
                      className="w-full"
                      defaultValue="120000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Inventory Turnover Days</label>
                    <Input
                      type="number"
                      placeholder="Enter inventory turnover days"
                      className="w-full"
                      defaultValue="45"
                    />
                  </div>
                  <Button className="w-full">Calculate Working Capital</Button>
                  
                  <div className="mt-4 p-4 bg-neutral-lightest rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-medium">Working Capital Needed:</span>
                      <span className="font-medium">₹180,000</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-medium">Cash Flow Cycle:</span>
                      <span className="font-medium">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-medium">Suggested Buffer:</span>
                      <span className="font-medium">₹60,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

// Importing the Input component that was used above but not imported
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-neutral-light bg-transparent px-3 py-2 text-sm placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary-light ${className}`}
      {...props}
    />
  );
};

export default FinancePage;

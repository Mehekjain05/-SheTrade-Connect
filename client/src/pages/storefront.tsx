import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { Product, Storefront } from "@/types";
import { generateProductDescription } from "@/lib/openai";
import { Helmet } from "react-helmet";

// Mock user ID for demonstration
const CURRENT_USER_ID = 1;

// Product form schema
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }).max(100),
  description: z.string().optional(),
  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
  image: z.string().url({ message: "Please enter a valid image URL" }).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const ProductCard = ({ 
  product,
  onEdit,
  onDelete
}: { 
  product: Product; 
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount / 100);
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-neutral-light flex items-center justify-center overflow-hidden">
        <img 
          src={product.image || "https://placehold.co/400x240?text=No+Image"} 
          alt={product.name} 
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-primary font-medium mt-1">
          {formatCurrency(product.price)}/meter
        </p>
        {product.description && (
          <p className="text-sm text-neutral-medium mt-2 line-clamp-3">
            {product.description}
          </p>
        )}
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
          >
            <i className="ri-edit-line mr-1"></i> Edit
          </Button>
          <Button 
            size="sm"
            variant="outline"
            className="text-error hover:text-error"
            onClick={() => onDelete(product.id)}
          >
            <i className="ri-delete-bin-line mr-1"></i> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AddProductForm = ({ 
  onAddSuccess, 
  editingProduct = null,
  onCancel
}: { 
  onAddSuccess: () => void;
  editingProduct: Product | null;
  onCancel: () => void;
}) => {
  const queryClient = useQueryClient();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: editingProduct?.name || "",
      description: editingProduct?.description || "",
      price: editingProduct ? editingProduct.price / 100 : undefined, // Convert from paise to rupees for the form
      image: editingProduct?.image || "",
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const productData = {
        userId: CURRENT_USER_ID,
        name: data.name,
        description: data.description || "",
        price: Math.round(data.price * 100), // Convert to paise for storage
        image: data.image || "",
      };
      
      if (editingProduct) {
        await apiRequest('PUT', `/api/products/${editingProduct.id}`, productData);
      } else {
        await apiRequest('POST', '/api/products', productData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products?userId=${CURRENT_USER_ID}`] });
      form.reset();
      onAddSuccess();
    }
  });

  const handleGenerateDescription = async () => {
    const productName = form.getValues("name");
    if (!productName) {
      form.setError("name", { message: "Please enter a product name first" });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const description = await generateProductDescription(
        productName, 
        "Textile", 
        ["Sustainable", "Eco-friendly", "High quality"]
      );
      form.setValue("description", description);
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };
  
  const onSubmit = (data: ProductFormValues) => {
    createProductMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Organic Cotton Fabric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Description</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateDescription}
                      disabled={isGeneratingDescription}
                      className="h-8"
                    >
                      {isGeneratingDescription ? (
                        <span className="flex items-center">
                          <i className="ri-loader-4-line animate-spin mr-1"></i> Generating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <i className="ri-magic-line mr-1"></i> AI Generate
                        </span>
                      )}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your product..." 
                      className="min-h-[100px]"
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about materials, quality, and unique features
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per meter (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 450" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the price in rupees (without the ₹ symbol)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a direct link to your product image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? 
                  (editingProduct ? "Updating..." : "Adding...") : 
                  (editingProduct ? "Update Product" : "Add Product")
                }
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const SetupStepItem = ({ 
  completed, 
  label, 
  onClick 
}: { 
  completed: boolean; 
  label: string;
  onClick: () => void;
}) => (
  <li className="flex items-center text-sm mb-2">
    <button 
      className="flex items-center text-left w-full"
      onClick={onClick}
    >
      <i className={`${completed ? 'ri-checkbox-circle-line text-success' : 'ri-checkbox-blank-circle-line text-neutral-medium'} mr-2`}></i>
      <span>{label}</span>
    </button>
  </li>
);

const StorefrontPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [`/api/products?userId=${CURRENT_USER_ID}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/products?userId=${CURRENT_USER_ID}`, undefined);
      return res.json() as Promise<Product[]>;
    }
  });

  const { data: storefront, isLoading: isLoadingStorefront } = useQuery({
    queryKey: [`/api/storefronts/${CURRENT_USER_ID}`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/storefronts/${CURRENT_USER_ID}`, undefined);
      return res.json() as Promise<Storefront>;
    }
  });

  const updateStorefrontMutation = useMutation({
    mutationFn: async (data: Partial<Storefront>) => {
      await apiRequest('PUT', `/api/storefronts/${CURRENT_USER_ID}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/storefronts/${CURRENT_USER_ID}`] });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest('DELETE', `/api/products/${productId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products?userId=${CURRENT_USER_ID}`] });
    }
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleAddProductSuccess = () => {
    setShowAddProductForm(false);
    setEditingProduct(null);
    
    // Update storefront steps if this is the first product
    if (products && products.length === 0 && storefront) {
      updateStorefrontMutation.mutate({
        ...storefront,
        setupSteps: {
          ...storefront.setupSteps,
          products: true
        },
        completionPercentage: calculateCompletionPercentage({
          ...storefront.setupSteps,
          products: true
        })
      });
    }
  };

  const calculateCompletionPercentage = (steps: Record<string, boolean>) => {
    const totalSteps = Object.keys(steps).length;
    const completedSteps = Object.values(steps).filter(Boolean).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const toggleSetupStep = (step: string) => {
    if (!storefront) return;
    
    const updatedSteps = {
      ...storefront.setupSteps,
      [step]: !storefront.setupSteps[step]
    };
    
    updateStorefrontMutation.mutate({
      ...storefront,
      setupSteps: updatedSteps,
      completionPercentage: calculateCompletionPercentage(updatedSteps)
    });
  };

  if (isLoadingStorefront || isLoadingProducts) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
            Your Digital Storefront
          </h1>
          <p className="text-neutral-medium">
            Manage your products and storefront settings
          </p>
        </div>
        <LoadingState type="card" count={3} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Storefront | SheTrade Connect</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
          Your Digital Storefront
        </h1>
        <p className="text-neutral-medium">
          Manage your products and storefront settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Storefront Setup Progress</CardTitle>
                <div className="flex items-center font-medium">
                  {storefront?.completionPercentage || 0}% Complete
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <Progress 
                value={storefront?.completionPercentage || 0} 
                className="h-2 mb-6" 
              />
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeTab === "products" ? "default" : "outline"}
                  className={activeTab === "products" ? "bg-primary text-white" : ""}
                  onClick={() => setActiveTab("products")}
                >
                  <i className="ri-shopping-bag-line mr-2"></i>
                  Products
                </Button>
                <Button 
                  variant={activeTab === "storefront" ? "default" : "outline"}
                  className={activeTab === "storefront" ? "bg-primary text-white" : ""}
                  onClick={() => setActiveTab("storefront")}
                >
                  <i className="ri-store-line mr-2"></i>
                  Storefront Details
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "outline"}
                  className={activeTab === "settings" ? "bg-primary text-white" : ""}
                  onClick={() => setActiveTab("settings")}
                >
                  <i className="ri-settings-line mr-2"></i>
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <SetupStepItem 
                  completed={storefront?.setupSteps.basicInfo || false} 
                  label="Basic store information"
                  onClick={() => toggleSetupStep("basicInfo")}
                />
                <SetupStepItem 
                  completed={storefront?.setupSteps.products || false}
                  label={`Add products (${products?.length || 0}/5)`}
                  onClick={() => toggleSetupStep("products")}
                />
                <SetupStepItem 
                  completed={storefront?.setupSteps.logo || false}
                  label="Upload company logo"
                  onClick={() => toggleSetupStep("logo")}
                />
                <SetupStepItem 
                  completed={storefront?.setupSteps.payment || false}
                  label="Connect payment methods"
                  onClick={() => toggleSetupStep("payment")}
                />
                <SetupStepItem 
                  completed={storefront?.setupSteps.shipping || false}
                  label="Set up shipping options"
                  onClick={() => toggleSetupStep("shipping")}
                />
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {activeTab === "products" && (
        <div className="space-y-6">
          {!showAddProductForm && (
            <div className="flex justify-end">
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={() => setShowAddProductForm(true)}
              >
                <i className="ri-add-line mr-2"></i>
                Add New Product
              </Button>
            </div>
          )}
          
          {showAddProductForm ? (
            <AddProductForm 
              onAddSuccess={handleAddProductSuccess}
              editingProduct={editingProduct}
              onCancel={() => {
                setShowAddProductForm(false);
                setEditingProduct(null);
              }}
            />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products yet"
              description="Add your first product to start building your digital storefront"
              actionLabel="Add Product"
              onAction={() => setShowAddProductForm(true)}
              icon="ri-shopping-bag-line"
            />
          )}
        </div>
      )}

      {activeTab === "storefront" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...useForm()}>
                <form className="space-y-4">
                  <FormField
                    name="businessName"
                    render={() => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input defaultValue="Eco Textiles Ltd" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="tagline"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input defaultValue="Sustainable fabrics from recycled materials" />
                        </FormControl>
                        <FormDescription>
                          A short slogan or description of your business
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name="description"
                    render={() => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[100px]"
                            defaultValue="We provide eco-friendly textile solutions using recycled materials. Our products are sustainably sourced and perfect for environmentally conscious fashion brands and retailers."
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="button" className="bg-primary hover:bg-primary-dark text-white">
                      Save Information
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Business Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-lg bg-primary-light flex items-center justify-center text-white text-3xl">
                  ET
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-medium mb-4">
                    Upload a logo to make your storefront more recognizable
                  </p>
                  <Button variant="outline">
                    <i className="ri-upload-2-line mr-2"></i>
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Storefront Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-lightest p-6 rounded-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-lg bg-primary-light mr-4 flex items-center justify-center text-white text-xl">
                    ET
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Eco Textiles Ltd</h2>
                    <p className="text-neutral-medium">Sustainable fabrics from recycled materials</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">About Us</h3>
                  <p className="text-neutral-medium mb-6">
                    We provide eco-friendly textile solutions using recycled materials. Our products are sustainably sourced and perfect for environmentally conscious fashion brands and retailers.
                  </p>
                  
                  <h3 className="font-medium mb-3">Featured Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {products && products.slice(0, 3).map((product) => (
                      <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-neutral-light">
                        <div className="h-24 bg-neutral-light flex items-center justify-center overflow-hidden">
                          <img 
                            src={product.image || "https://placehold.co/400x240?text=No+Image"} 
                            alt={product.name} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-primary font-medium text-sm mt-1">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0,
                            }).format(product.price / 100)}
                            /meter
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-bank-card-line text-xl mr-3 text-primary"></i>
                    <span>Credit/Debit Cards</span>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-paypal-line text-xl mr-3 text-primary"></i>
                    <span>PayPal</span>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-bank-line text-xl mr-3 text-primary"></i>
                    <span>Bank Transfer</span>
                  </div>
                  <Switch checked={false} />
                </div>
                <Button className="w-full">
                  Set Up Payment Methods
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-truck-line text-xl mr-3 text-primary"></i>
                    <span>Standard Shipping</span>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-rocket-line text-xl mr-3 text-primary"></i>
                    <span>Express Shipping</span>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-store-line text-xl mr-3 text-primary"></i>
                    <span>Store Pickup</span>
                  </div>
                  <Switch checked={false} />
                </div>
                <Button className="w-full">
                  Configure Shipping
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Storefront</p>
                    <p className="text-sm text-neutral-medium">Make your storefront visible to others</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Product Prices</p>
                    <p className="text-sm text-neutral-medium">Display product prices publicly</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Contact Information</p>
                    <p className="text-sm text-neutral-medium">Display your contact information to potential buyers</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Customer Reviews</p>
                    <p className="text-sm text-neutral-medium">Let customers leave reviews for your products</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

// Import the Switch component that was used but not imported
const Switch = ({ 
  checked = false, 
  onChange 
}: { 
  checked?: boolean;
  onChange?: () => void;
}) => {
  return (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-neutral-light'
      }`}
      onClick={onChange}
      type="button"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default StorefrontPage;

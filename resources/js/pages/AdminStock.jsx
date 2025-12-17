import React, { useState } from 'react';
import { api } from '../api/client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, CheckCircle, Edit2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminStock() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.entities.Product.list(),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, stock_quantity }) =>
      api.entities.Product.update(id, { stock_quantity: parseInt(stock_quantity) }),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Stock mis à jour');
      handleCloseDialog();
    },
  });

  const handleOpenDialog = (product) => {
    setEditingProduct(product);
    setNewStock(product.stock_quantity.toString());
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setNewStock('');
  };

  const handleUpdateStock = () => {
    if (editingProduct && newStock !== '') {
      updateMutation.mutate({
        id: editingProduct.id,
        stock_quantity: newStock,
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'low' && product.stock_quantity <= 5 && product.stock_quantity > 0) ||
      (filterStatus === 'out' && product.stock_quantity === 0);
    return matchesSearch && matchesFilter;
  });

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;
  const inStockCount = products.filter(p => p.stock_quantity > 5).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h2>
        <p className="text-gray-600 mt-1">Suivez et gérez vos niveaux de stock</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Produits</p>
                  <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <Package className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">En Stock</p>
                  <p className="text-3xl font-bold text-gray-900">{inStockCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Stock Faible</p>
                  <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rupture</p>
                  <p className="text-3xl font-bold text-gray-900">{outOfStockCount}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className={filterStatus === 'all' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' : ''}
          >
            Tous
          </Button>
          <Button
            variant={filterStatus === 'low' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('low')}
            className={filterStatus === 'low' ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
          >
            Stock faible
          </Button>
          <Button
            variant={filterStatus === 'out' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('out')}
            className={filterStatus === 'out' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
          >
            Rupture
          </Button>
        </div>
      </motion.div>

      {/* Stock Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-xl">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Image</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Stock Actuel</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>
                          <img
                            src={product.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {product.category_name || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-2xl font-bold ${
                            product.stock_quantity > 5
                              ? 'text-green-600'
                              : product.stock_quantity > 0
                              ? 'text-orange-600'
                              : 'text-red-600'
                          }`}>
                            {product.stock_quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.stock_quantity > 5 ? (
                            <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              En stock
                            </Badge>
                          ) : product.stock_quantity > 0 ? (
                            <Badge className="bg-orange-100 text-orange-700 border-0 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              Stock faible
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 border-0 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              Épuisé
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleOpenDialog(product)}
                            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos filtres</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Update Stock Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mettre à jour le stock</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={editingProduct.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'}
                  alt={editingProduct.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{editingProduct.name}</p>
                  <p className="text-sm text-gray-600">Stock actuel: {editingProduct.stock_quantity}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouvelle quantité
                </label>
                <Input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button
              onClick={handleUpdateStock}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white"
              disabled={updateMutation.isPending}
            >
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


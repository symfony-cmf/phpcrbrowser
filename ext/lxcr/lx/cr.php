<?php

class lx_cr {
	
	/**
	 * 
	 * 
	 *
	 * @param unknown_type $repo
	 * @return lx_cr_repository the created repository
	 */
	
	static function lookup($storage, $repo = '') {
        return new lx_cr_repository($storage,$repo);
	}
}